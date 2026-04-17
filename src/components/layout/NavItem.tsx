import { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'

type NavItemProps = {
    icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    label?: string
    href?: string
    isDesktop?: boolean
    onClick?: () => void
}

const NavItem = ({ icon, label, href, isDesktop = false, onClick }: NavItemProps) => {
    const className = isDesktop
        ? 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-primary'
        : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900'

    const Icon = icon

    if (href) {
        return (
            <Link href={href} className={className}>
                {Icon && <Icon />}
                {label}
            </Link>
        )
    }

    return (
        <button type="button" onClick={onClick} className={`w-full text-left ${className}`}>
            {label}
        </button>
    )
}

export default NavItem
