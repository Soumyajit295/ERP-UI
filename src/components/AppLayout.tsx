import { useState, type ReactNode } from "react"
import { SidebarContext } from "@/hooks/useSidebar"
import { AppSidebar } from "@/components/AppSidebar"

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen((prev) => !prev) }}>
      <div className="flex min-h-svh">
        <AppSidebar />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </SidebarContext.Provider>
  )
}
