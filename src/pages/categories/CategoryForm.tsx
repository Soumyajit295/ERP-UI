import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormTextArea } from "@/formComponent/FormTextArea"
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validation/category.validation"
import { createCategory, updateCategory, type CategoryRecord } from "@/services/category.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface CategoryFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: CategoryRecord | null
    onSuccess?: () => void
}

const defaultValues: CategoryFormValues = {
    name: "",
    description: ""
}

export function CategoryForm({
    open,
    onOpenChange,
    category,
    onSuccess
}: CategoryFormProps){
    const isEdit = !!category

    const form = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues
    })

    const {formState: {isSubmitting}, reset, control} = form

    useEffect(() => {
        if(!open) return

        reset(
            category 
                ? {
                    name: category.categoryName,
                    description: category.description
                }
                : defaultValues
        )
    },[category,open,reset])

    const handleSubmit = async(data: CategoryFormValues) => {
        const payload = {
            name: data.name,
            description: data.description
        }

        try {
            if(category){
                const resp = await updateCategory(category.categoryId,payload)
                toast.success(resp.message || "Category updated successfully")
            } else {
                await createCategory(payload)
                toast.success('Category created successfully')
            }
            onSuccess?.()
        } catch (error: any) {
            toast.error(error.message || 'Failed to save category')
        }
    }

    return (
        <CustomSlider
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Category" : "Create Category"}
            description={isEdit ? "Create new category" : "Update existing category"}
            submitLabel={isEdit ? "Update" : "Create"}
            loading={isSubmitting}
            onSubmit={form.handleSubmit(handleSubmit)}
            onCancel={() => form.reset(defaultValues)}
        >
            <form className="space-y-4 pb-4 pt-1" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormInputField control={control} name="name" label="Category Name" required placeholder="Enter Category Name"/>
                <FormTextArea control={control} name="description" label="Description" placeholder="Enter Category description"/>
            </form>
        </CustomSlider>
    )
}