import { fetchWithAuth } from "@/common/utils"

interface SigninRequestDto {
    email: string
    password: string
}

interface RegisterRequestDto {
    companyName: string
    city?: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    password: string
}

interface AuthResponse {
    accessToken: string
}

export const signin = async (payload: SigninRequestDto): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>('auth/login', {
        method: 'POST',
        body: payload,
        skipAuth: true,
    })
}

export const register = async (payload: RegisterRequestDto): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>('auth/register', {
        method: 'POST',
        body: payload,
        skipAuth: true,
    })
}

export const getMeData = async() => {
    return fetchWithAuth('auth/me')
}
