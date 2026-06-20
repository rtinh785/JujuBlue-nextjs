import React, { Fragment } from 'react'

type NavSectionProps = {
    title?: string
    children: React.ReactNode
    isDesktop?: boolean
}

const NavSection = ({ title, children, isDesktop }: NavSectionProps) => {
    if (isDesktop) {
        const items = React.Children.toArray(children).filter(Boolean)

        return (
            <nav className="hidden h-full items-stretch lg:flex lg:gap-x-3">
                {items.map((child, index) => (
                    <Fragment key={index}>{child}</Fragment>
                ))}
            </nav>
        )
    }

    return (
        <div className="px-3">
            <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{title}</p>
            <nav className="flex flex-col gap-0.5">{children}</nav>
        </div>
    )
}

export default NavSection
