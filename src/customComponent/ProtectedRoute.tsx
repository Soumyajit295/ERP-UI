import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export interface ProtectedRouteProps {
    children: ReactNode,
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
}) => {
    const location = useLocation()
    const accessToken = localStorage.getItem('access_token')
    
    if(!accessToken){
        return <Navigate to='/signin' replace state={{from: location}}/>
    }

    return <>{children}</>
}