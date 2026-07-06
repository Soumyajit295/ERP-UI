import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FormInputField } from "@/formComponent/FormInputField"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation"
import { forgetPassword } from "@/services/auth.service"

export default function ForgotPassword() {

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const {formState: {isSubmitting}, control} = form

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      const resp = await forgetPassword({email: data.email})
      toast.success(resp?.message || "Reset mail send successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link")
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Forgot password?</CardTitle>
          <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormInputField control={control} name="email" label="Email" required type="email" placeholder="john@example.com" />
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" variant="success" className="w-full" loading={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/signin" className="font-medium text-success hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
