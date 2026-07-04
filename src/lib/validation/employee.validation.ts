import { z } from "zod"

export const employeeFormSchema = z.object({
  fname: z.string().min(1, "First name is required"),
  lname: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().optional(),
  roleId: z.string().min(1, "Role is required"),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
