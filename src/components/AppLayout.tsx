import { useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarContext } from "@/hooks/useSidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Navbar } from "@/components/Navbar"

export function AppLayout() {
  const [open, setOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen((prev) => !prev) }}>
      <div className="flex min-h-svh">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-2">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
