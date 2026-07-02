interface PageContainerProps {
    children: React.ReactNode
}

export const PageContainer = ({children}: PageContainerProps) => {
    return (
        <div className="flex flex-col p-2">{children}</div>
    )
}