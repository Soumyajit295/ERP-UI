import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { InputField } from "@/customComponent/form-components/InputField"
import { register as registerApi } from "@/services/auth.service"
import { registerSchema, type RegisterFormData } from "@/lib/validation"

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setLoading(true)
    try {
      await registerApi(data)
      toast.success("Account created successfully! Please sign in.")
      navigate("/signin")
    } catch {
      toast.error("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Fill in the details below to register your company</CardDescription>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <InputField name="companyName" label="Company Name" required placeholder="Acme Pvt Ltd" />
              <InputField name="city" label="City" placeholder="Mumbai" />

              <div className="grid grid-cols-2 gap-4">
                <InputField name="firstName" label="First Name" required placeholder="John" />
                <InputField name="lastName" label="Last Name" required placeholder="Doe" />
              </div>

              <InputField name="email" label="Email" required type="email" placeholder="john.doe@example.com" />
              <InputField name="phone" label="Phone" type="tel" placeholder="+919876543210" />
              <InputField name="password" label="Password" required type="password" placeholder="At least 5 characters" />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" variant="success" className="w-full" loading={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="font-medium text-success hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
