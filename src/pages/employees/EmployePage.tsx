import { CustomSlider } from "@/customComponent/CustomSlider"
import { PageContainer } from "@/customComponent/PageContainer"
import { PageHeader } from "@/customComponent/PageHeader"
import { useState } from "react"

export const EmployePage = () => {
    const [productForm,setProductForm] = useState(false)
    return(
        <PageContainer>
            <PageHeader
                pageName="Employees"
                pageSubName="Manage your team members and their roles Add Employee"
                actionButtonLabel="Add Employee"
                onActionButtonClick={()=>setProductForm(true)}
            />
            <p>Payments page</p>
            <CustomSlider open={productForm} onOpenChange={()=>setProductForm(false)} title="Employee form" cancelLabel="close" onCancel={()=>setProductForm(false)}/>
        </PageContainer>
    )
}