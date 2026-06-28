import { useAuthStore } from "@/stores/auth.store"

export default function Dashboard() {
  const {user} = useAuthStore()

  console.log(user)
  return <p className="text-muted-foreground">Dashboard</p>
}
