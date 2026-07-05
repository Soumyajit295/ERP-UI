import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import SignIn from "@/pages/auth/SignIn"
import Register from "@/pages/auth/Register"
import ForgotPassword from "@/pages/auth/ForgotPassword"
import ResetPassword from "@/pages/auth/ResetPassword"
import Dashboard from "@/pages/app/Dashboard"
import type { ReactNode } from "react"
import { ProtectedRoute, type ProtectedRouteProps } from "./customComponent/ProtectedRoute"
import { EmployePage } from "./pages/employees/EmployePage"
import { RolePermissionPage } from "./pages/system/RolePermissionPage"

export function AppRouter() {

  const guard = (children: ReactNode,options?: Omit<ProtectedRouteProps, 'children'>) => {
    return <ProtectedRoute {...options}>{children}</ProtectedRoute>
  }

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={guard(<AppLayout />)}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/employee" element={<EmployePage/>}/>
        <Route path="/role-permission" element={<RolePermissionPage/>}/>
      </Route>
    </Routes>
  )
}
