import { useAuthStore } from "@/stores/auth.store"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, clearUser } = useAuthStore()
  const navigate = useNavigate()

  const initials = user
    ? `${user.fname.charAt(0)}${user.lname.charAt(0)}`.toUpperCase()
    : "?"

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    clearUser()
    navigate("/signin")
  }

  return (
    <header className="flex h-14 items-center justify-end border-b border-border px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex cursor-pointer items-center gap-3 outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
              {initials}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.fname} {user?.lname}</span>
              <span className="text-xs text-muted-foreground">{user?.roleName}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer text-red-500 focus:text-red-600">
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
