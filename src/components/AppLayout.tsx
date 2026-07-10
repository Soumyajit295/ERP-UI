import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { SidebarContext } from "@/hooks/useSidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Navbar } from "@/components/Navbar"

const SIDEBAR_KEY = "sidebar-open"

export function AppLayout() {
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    return stored !== null ? stored === "true" : true
  })

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(open))
  }, [open])

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen((prev) => !prev) }}>
      <div className="flex h-svh overflow-hidden">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-2">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
