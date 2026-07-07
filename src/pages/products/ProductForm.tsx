import { ProductStatus } from "@/common/enums/Productstatus.enum"
import { CustomSlider } from "@/customComponent/CustomSlider"
import { FormInputField } from "@/formComponent/FormInputField"
import { FormInputSelect } from "@/formComponent/FormInputSelect"
import { FormTextArea } from "@/formComponent/FormTextArea"
import { ProductFormSchema, type ProductFormValues } from "@/lib/validation/product.validation"
import { createProduct, updateProduct, type CategoryOptions, type CreateProductRequestDto, type ProductDetailsResponse, type ProductRecord } from "@/services/products.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface ProductFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: ProductDetailsResponse | null
    onSuccess?: () => void
    categoryOptions: CategoryOptions
}

const defaultValues: ProductFormValues = {
    name: "",
    sku: "",
    categoryId: "",
    purchasePrice: 0,
    sellingPrice: 0,
    status: "INACTIVE",
    barcode: "",
    description: "",
    reorderLevel: 20
}

export function ProductForm({
    open,
    onOpenChange,
    categoryOptions,
    onSuccess,
    product
}: ProductFormProps) {
    const isEdit = !!product

    const form = useForm({
        resolver: zodResolver(ProductFormSchema),
        defaultValues
    })

    const {formState: {isSubmitting}, reset, control} = form

    useEffect(() => {
        if(!open) return

        reset(
            product
                ? {
                    name: product.productName,
                    barcode: product.barcode,
                    categoryId: product.categoryId,
                    description: product?.description,
                    purchasePrice: product.purchasePrice,
                    reorderLevel: product.reorderLevel,
                    sellingPrice: product.sellingPrice,
                    sku: product.sku,
                    status: product.status
                }
                : defaultValues
        )
    },[product, open, reset])

    const handleSubmit = async(data: ProductFormValues) => {
        const payload: CreateProductRequestDto = {
            name: data.name,
            barcode: data?.barcode ?? '',
            categoryId: data.categoryId,
            description: data?.description ?? '',
            purchasePrice: Number(data?.purchasePrice),
            reorderLevel: Number(data?.reorderLevel) ?? 20,
            sellingPrice: Number(data?.sellingPrice),
            sku: data?.sku,
            status: data?.status
        }
        try {
            if(product){
                const resp = await updateProduct(product.productId, payload)
                toast.success(resp.message || 'Product updated successfully')
            } else {
                await createProduct(payload)
                toast.success('Product created successfully')
            }
            onSuccess?.()
        } catch (error: any) {
            toast.error(error.message || 'Failed to save product')
        }
    }

    return (
        <CustomSlider
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Product" : "Create Product"}
            description={isEdit ? "Create new product" : "Update existing product"}
            submitLabel={isEdit ? "Update" : "Create"}
            loading={isSubmitting}
            onSubmit={form.handleSubmit(handleSubmit)}
            onCancel={() => form.reset(defaultValues)}
        >
            <form className="space-y-4 pb-4 pt-1" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormInputField control={control} name="name" label="Product Name" required placeholder="Enter Product Name"/>
                <FormInputField control={control} name="sku" label="SKU" required placeholder="Enter Product SKU"/>
                <FormInputField control={control} name="barcode" label="Product Barcode" required placeholder="Enter Product Barcode"/>
                <FormInputSelect control={control} name="categoryId" label="Category" placeholder="Select Category" required options={categoryOptions || []}/>
                <FormInputField control={control} name="purchasePrice" label="Purchase Price" placeholder="Enter Purchase Price" required/>
                <FormInputField control={control} name="sellingPrice" label="Selling Price" placeholder="Enter Selling Price" required/>
                <FormInputField control={control} name="reorderLevel" label="Reorder level" placeholder="Enter reorder level" required/>
                <FormInputSelect control={control} name="status" label="Status" placeholder="Select Status" required options={[{label: 'Active',value: ProductStatus.ACTIVE},{label: 'Inactive',value: ProductStatus.INACTIVE}]}/>
                <FormTextArea control={control} name="description" label="Description" placeholder="Enter product description"/>
            </form>
        </CustomSlider>
    )
}