import { useAuthStore } from "@/stores/auth.store";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export interface ProtectedRouteProps {
    children: ReactNode,
    requiredPermissions?: string[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredPermissions = []
}) => {
    const location = useLocation()
    const accessToken = localStorage.getItem('access_token')
    const {user} = useAuthStore()
    
    if(!accessToken){
        return <Navigate to='/signin' replace state={{from: location}}/>
    }

    const hasPermissions = requiredPermissions.length === 0 || user?.permissions?.some((permission) => requiredPermissions.includes(permission))

    if(!hasPermissions){
        return null
    }
    
    return <>{children}</>
}