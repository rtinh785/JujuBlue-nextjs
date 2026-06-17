import { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

type NavItemProps = {
    icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
    label?: string
    href?: string
    isDesktop?: boolean
    isActive?: boolean
    onClick?: () => void
}

const NavItem = ({ icon, label, href, isDesktop = false, isActive = false, onClick }: NavItemProps) => {
    const Icon = icon

    // Desktop: chỉ icon, không label. Trạng thái active có nền pill nhẹ
    // + underline nhỏ phía dưới để báo đang ở trang nào, thay vì để icon
    // trơ trọi như trước.
    if (isDesktop) {
        const iconWrapperClass = isActive
            ? 'flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors'
            : 'flex size-10 items-center justify-center rounded-lg text-gray-500 min-w-[120px] transition-colors hover:bg-gray-100 hover:text-primary'

        const content = (
            <span className="flex flex-col items-center gap-1.5 min-w-[100px]">
                <span className={iconWrapperClass}>{Icon && <Icon className="size-[27px]" />}</span>
              
            </span>
        )

        if (href) {
            return (
                <Link href={href} aria-current={isActive ? 'page' : undefined}>
                    {content}
                </Link>
            )
        }

        return (
            <button type="button" onClick={onClick}>
                {content}
            </button>
        )
    }

    // Mobile drawer: giữ nguyên kiểu icon + label hàng ngang như trước
    const mobileClassName = 'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900'

    if (href) {
        return (
            <Link href={href} className={mobileClassName}>
                {Icon && <Icon />}
                {label}
            </Link>
        )
    }

    return (
        <button type="button" onClick={onClick} className={`w-full text-left ${mobileClassName}`}>
            {label}
        </button>
    )
}

export default NavItem
