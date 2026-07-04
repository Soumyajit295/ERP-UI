import { Plus } from "lucide-react"
import { CustomButton } from "./CustomButton"

interface PageHeaderProps {
  pageName: string
  pageSubName?: string
  actionButtonLabel: string
  onActionButtonClick?: () => void
  extraButton?: React.ReactNode
  addPermission?: boolean
}

export function PageHeader({ pageName, pageSubName, actionButtonLabel, onActionButtonClick, extraButton , addPermission}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold">{pageName}</h1>
        {pageSubName && (
          <p className="mt-0.5 text-sm text-muted-foreground">{pageSubName}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {extraButton}
        {addPermission && (
          <CustomButton
              icon={<Plus className="size-4" />}
              label={actionButtonLabel}
              onClick={onActionButtonClick}
              className="p-5"
          />
        )}
      </div>
    </div>
  )
}
