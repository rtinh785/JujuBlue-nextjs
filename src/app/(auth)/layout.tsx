const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="flex h-screen w-full items-center justify-center">
                <section className="bg-primary hidden h-full text-white lg:block lg:w-1/2">
                    <div className="align-center flex h-full flex-col items-center justify-center p-8">
                        <div className="flex size-[96px] items-center justify-center rounded-[12px] bg-white px-[16px] py-[8px]">
                            <img src="/images/svg/logo.svg" alt="Juju Blue Logo" className="h-10 w-auto object-cover" />
                        </div>
                        <h1 className="mt-6 text-4xl font-bold">Juju Blue</h1>
                        <p className="mt-6 text-[18px] font-[500]">Elevate your discourse.</p>
                    </div>
                </section>
                <section className="flex items-center justify-center bg-white px-4 py-8 text-black sm:px-6 md:px-10 lg:w-1/2 lg:px-16 xl:px-24">
                    {children}
                </section>
            </div>
        </>
    )
}

export default layout
