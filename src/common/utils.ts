interface FetchWithAuthOptions extends RequestInit {
    skipAuth?: boolean
}

export const fetchWithAuth = async<T>(
    url: string,
    options: FetchWithAuthOptions = {}
) => {
    const {skipAuth = false,headers={},body,method,...restOptions} = options

    const isFormData = body instanceof FormData

    const token = localStorage.getItem('access_token')

    const defaultHeaders: HeadersInit = {
        ...(!isFormData && method!=='GET' && method!=='DELETE' ? { 'Content-Type': 'application/json' } : {}),
        ...(token && !skipAuth ? {Authorization : `Bearer ${token}`} : {}),
        ...headers
    }

    const finalOptions = {
        ...restOptions,
        method,
        headers: defaultHeaders,
        body
    }

    const response = await fetch(url,finalOptions)

    if(!response.ok){
        let message = "API ERROR"
        const error = await response.json()
        message = error.message || message
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}