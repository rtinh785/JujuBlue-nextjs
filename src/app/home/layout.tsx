import Header from '@/components/layout/Header'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default layout
