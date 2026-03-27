import Link from 'next/link'

type NavItemProps = {
    icon?: string
    label: string
    href?: string
    isDesktop?: boolean
    onClick?: () => void
}

const NavItem = ({ icon, label, href, isDesktop = false, onClick }: NavItemProps) => {
    const className = isDesktop
        ? 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-lg font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-primary'
        : 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900'

    if (href) {
        return (
            <Link href={href} className={className}>
                {icon && <img src={icon} alt={label} className={isDesktop ? 'hover:text-primary h-6 w-6' : ''} />}
                {label}
            </Link>
        )
    }

    return (
        <button type="button" onClick={onClick} className={`w-full text-left ${className}`}>
            <img src={icon} alt={label} />
            {label}
        </button>
    )
}

export default NavItem
