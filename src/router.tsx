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
import { ProductPage } from "./pages/products/ProductPage"
import { CategoryPage } from "./pages/categories/CategoryPage"
import { SupplierPage } from "./pages/suppliers/SupplierPage"
import { ProductDetails } from "./pages/products/ProductDetails"
import { SupplierDetails } from "./pages/suppliers/SupplierDetail"
import { PurchaseOrderPage } from "./pages/purchase-orders/PurchaseOrderPage"
import { PurchaseOrderDetails } from "./pages/purchase-orders/PurchaseOrderDetails"
import { InventoryPage } from "./pages/inventory/InventoryPage"
import { WarehousePage } from "./pages/warehouses/WarehousePage"
import { WarehouseDetails } from "./pages/warehouses/WarehouseDetails"

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
        <Route path="/products" element={<ProductPage/>}/>
        <Route path="/products/:productId" element={<ProductDetails/>}/>
        <Route path="/categories" element={<CategoryPage/>}/>
        <Route path="/suppliers" element={<SupplierPage/>}/>
        <Route path="/suppliers/:supplierId" element={<SupplierDetails/>}/>
        <Route path="/purchase-orders" element={<PurchaseOrderPage/>}/>
        <Route path="/purchase-orders/:purchaseOrderId" element={<PurchaseOrderDetails/>}/>
        <Route path="/inventory" element={<InventoryPage/>}/>
        <Route path="/warehouses" element={<WarehousePage/>}/>
        <Route path="/warehouses/:warehouseId" element={<WarehouseDetails/>}/>
      </Route>
    </Routes>
  )
}
