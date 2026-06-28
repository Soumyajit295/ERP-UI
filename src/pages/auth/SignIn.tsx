import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { InputField } from "@/customComponent/InputField"
import { signin } from "@/services/auth.service"
import { signinSchema, type SigninFormData } from "@/lib/validation"

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  })

  async function onSubmit(data: SigninFormData) {
    setLoading(true)
    try {
      const res = await signin(data)
      localStorage.setItem("access_token", res.accessToken)
      toast.success("Signed in successfully!")
      navigate("/dashboard", { replace: true })
    } catch {
      toast.error("Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <InputField name="email" label="Email" required type="email" placeholder="john@example.com" />
              <InputField name="password" label="Password" required type="password" placeholder="••••••••" />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" variant="success" className="w-full" loading={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-medium text-success hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
