import { Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/AppLayout"
import SignIn from "@/pages/auth/SignIn"
import Register from "@/pages/auth/Register"
import Dashboard from "@/pages/app/Dashboard"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}
