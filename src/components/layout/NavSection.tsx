import React from 'react'

type NavSectionProps = {
    title?: string
    children: React.ReactNode
    isDesktop?: boolean
}

const NavSection = ({ title, children, isDesktop }: NavSectionProps) => {
    if (isDesktop) {
        return <nav className="hidden items-center justify-center gap-x-1 lg:flex">{children}</nav>
    } else {
        return (
            <div className="px-3">
                <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{title}</p>
                <nav className="flex flex-col gap-0.5">{children}</nav>
            </div>
        )
    }
}

export default NavSection
