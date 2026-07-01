import { useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { InputField } from "@/customComponent/InputField"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validation"
import { resetPassword } from "@/services/auth.service"

export default function ResetPassword() {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const {formState: {isSubmitting}} = form
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  async function onSubmit(data: ResetPasswordFormData) {
    if(!token){
      toast.error("Reset token not found")
      return
    }
    try {
      const resp = await resetPassword({
        token,
        password: data.password
      })
      toast.success(resp.message || "Password reset successfully")
      navigate('/signin')
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password")
    }
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
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" variant="success" className="w-full" loading={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
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
