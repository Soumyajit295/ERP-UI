import { create } from "zustand"

export interface UserProfile {
  userId: string
  fname: string
  lname: string
  email: string
  phone: string | null
  tenantId: string
  companyName: string
  roleName: string
  permissions: string[]
}

interface AuthState {
  user: UserProfile | null
  setUser: (user: UserProfile) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    clearUser: () => set({user: null})
}))