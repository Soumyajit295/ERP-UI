interface FetchWithAuthOptions extends Omit<RequestInit, 'body'> {
    skipAuth?: boolean
    body?: unknown
}

export class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchWithAuth = async<T>(
    url: string,
    options: FetchWithAuthOptions = {}
) => {
    const {skipAuth = false,headers={},body,method,...restOptions} = options

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

    const response = await fetch(`${BASE_URL}${url}`,finalOptions)

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