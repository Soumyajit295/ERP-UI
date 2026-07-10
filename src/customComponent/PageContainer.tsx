interface PageContainerProps {
    children: React.ReactNode
}

export const PageContainer = ({children}: PageContainerProps) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-2">{children}</div>
    )
}
