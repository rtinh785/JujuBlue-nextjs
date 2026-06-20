'use client'

import { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type NavItemProps = {
    icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    label?: string
    href?: string
    isDesktop?: boolean
    onClick?: () => void
}

const NavItem = ({ icon, label, href, isDesktop = false, onClick }: NavItemProps) => {
    const Icon = icon
    const pathname = usePathname()
    const isActive = !!href && pathname === href

    // ── Desktop: icon-only, LinkedIn-style active underline ──────────────────
    if (isDesktop) {
        const iconColor = isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'

        const content = (
            <span
                className={[
                    'relative flex h-full flex-col items-center justify-center gap-0 px-3 py-2 transition-colors',
                    iconColor,
                    // gạch chân khi active
                    isActive
                        ? 'after:bg-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full'
                        : 'after:bg-primary after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100',
                ].join(' ')}
            >
                {Icon && <Icon className="size-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />}
            </span>
        )

        if (href) {
            return (
                <Link href={href} aria-current={isActive ? 'page' : undefined} className="flex h-full items-stretch">
                    {content}
                </Link>
            )
        }

        return (
            <button type="button" onClick={onClick} className="flex h-full items-stretch">
                {content}
            </button>
        )
    }

    // ── Mobile drawer: icon + label hàng ngang ───────────────────────────────
    const mobileClassName =
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900'

    if (href) {
        return (
            <Link href={href} className={mobileClassName}>
                {Icon && <Icon className="size-[22px]" strokeWidth={1.8} />}
                {label}
            </Link>
        )
    }

    return (
        <button type="button" onClick={onClick} className={`w-full text-left ${mobileClassName}`}>
            {Icon && <Icon className="size-[22px]" strokeWidth={1.8} />}
            {label}
        </button>
    )
}

export default NavItem
