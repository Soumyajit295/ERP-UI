import { fetchWithAuth } from "@/common/utils"
import type { UserProfile } from "@/stores/auth.store"

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

interface ForgetPasswordDto {
    email: string
}

interface ResetPasswordDto {
    token: string
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
        credentials: 'include'
    })
}

export const register = async (payload: RegisterRequestDto): Promise<AuthResponse> => {
    return fetchWithAuth<AuthResponse>('auth/register', {
        method: 'POST',
        body: payload,
        skipAuth: true,
    })
}

export const getMeData = async(): Promise<UserProfile> => {
    return fetchWithAuth<UserProfile>('auth/me')
}

export const logout = async() => {
    return fetchWithAuth('auth/logout')
}

export const forgetPassword = async(payload: ForgetPasswordDto): Promise<{message: string}> => {
    return fetchWithAuth('auth/generate-resetlink',{method: 'POST',body: payload,skipAuth: true})
}

export const resetPassword = async(payload: ResetPasswordDto): Promise<{message: string}> => {
    return fetchWithAuth('auth/reset-password',{method: 'POST',body: payload,skipAuth: true})
}