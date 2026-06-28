import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarContext } from "@/hooks/useSidebar"
import { AppSidebar } from "@/components/AppSidebar"

export function AppLayout() {
  const [open, setOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen((prev) => !prev) }}>
      <div className="flex min-h-svh">
        <AppSidebar />
        <main className="flex flex-1 flex-col p-2">
          <Outlet />
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
