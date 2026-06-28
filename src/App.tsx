import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppRouter } from "@/router"
import { getMeData } from "@/services/auth.service"
import { useAuthStore } from "@/stores/auth.store"
import { ApiError } from "@/common/utils"
import { Toaster } from "@/components/ui/toaster"

function App() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    const getMe = async () => {
      try {
        const user = await getMeData()
        setUser(user)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          navigate("/signin", { replace: true })
        }
      }
    }
    getMe()
  }, [navigate, setUser])

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  )
}

export default App
