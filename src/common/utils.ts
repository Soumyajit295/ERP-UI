import { useAuthStore } from "@/stores/auth.store"

type QueryValue = string | number | boolean | null | undefined
type QueryParams = object

interface FetchWithAuthOptions extends Omit<RequestInit, 'body'> {
    skipAuth?: boolean
    body?: unknown
    query?: QueryParams
}

export class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const refreshAccessToken = async(): Promise<string> => {
    const response = await fetch(`${BASE_URL}auth/refresh-token`,{
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        localStorage.removeItem('access_token')
        window.location.href = "/signin";
    }

    const data = await response.json();

    if (!data?.accessToken) {
        localStorage.removeItem("access_token");
        window.location.href = "/signin";
    }

    localStorage.setItem("access_token", data.accessToken);

    return data.accessToken;
}

export const fetchWithAuth = async<T>(
    url: string,
    options: FetchWithAuthOptions = {}
) => {
    const {skipAuth = false,headers={},body,method,query,...restOptions} = options

    const isFormData = body instanceof FormData
    const isJsonBody = !isFormData && typeof body === 'object' && body !== null

    const token = localStorage.getItem('access_token')

    const defaultHeaders: HeadersInit = {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...(token && !skipAuth ? {Authorization : `Bearer ${token}`} : {}),
        ...headers
    }

    const finalBody = isJsonBody ? JSON.stringify(body) : (body as BodyInit | null | undefined)

    const finalOptions = {
        ...restOptions,
        method,
        headers: defaultHeaders,
        body: finalBody
    }

    const queryString = buildQueryString(query)
    const separator = url.includes('?') ? '&' : '?'
    const finalUrl = queryString ? `${BASE_URL}${url}${separator}${queryString}` : `${BASE_URL}${url}`

    let response = await fetch(finalUrl,finalOptions)

    if(response.status === 401 && !skipAuth){
        const newAccessToken = await refreshAccessToken()

        finalOptions.headers = {
            ...defaultHeaders,
            Authorization : `Bearer ${newAccessToken}`
        }

        response = await fetch(finalUrl,finalOptions)
    }

    if(!response.ok){
        let message = "API ERROR"
        try {
            const error = await response.json()
            message = error.message || message
        } catch {}
        throw new ApiError(message, response.status)
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

const buildQueryString = (query?: QueryParams) => {
    if (!query) return ""

    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
        const values = Array.isArray(value) ? value : [value as QueryValue]

        values.forEach((item) => {
            if (item === undefined || item === null || item === "") return
            params.append(key, String(item))
        })
    })

    return params.toString()
}

export const hasPermission = (requiredPermission: string) => {
    const {user} = useAuthStore()

    return Boolean(user?.permissions?.includes(requiredPermission))
}
