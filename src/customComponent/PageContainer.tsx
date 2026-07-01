interface PageContainerProps {
    children: React.ReactNode
}

export const PageContainer = ({children}: PageContainerProps) => {
    return (
        <div className="p-2">{children}</div>
    )
}