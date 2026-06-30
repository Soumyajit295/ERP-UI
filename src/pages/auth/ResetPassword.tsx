import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { InputField } from "@/customComponent/InputField"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validation"

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit(_data: ResetPasswordFormData) {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResetDone(true)
      toast.success("Password reset successfully!")
    } catch {
      toast.error("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (resetDone) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Password reset</CardTitle>
            <CardDescription>
              Your password has been reset successfully. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="success" className="w-full" asChild>
              <Link to="/signin">Sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <InputField name="password" label="New Password" required type="password" placeholder="At least 5 characters" />
              <InputField name="confirmPassword" label="Confirm Password" required type="password" placeholder="Re-enter your password" />
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" variant="success" className="w-full" loading={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
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
