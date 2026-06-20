'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import MobileDrawer from '@/components/layout/MobileDrawer'
import SearchInput from '@/components/form/SearchInput'
import NavSection from '@/components/layout/NavSection'
import NavItem from '@/components/layout/NavItem'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/base/dropdown-menu'
import MyButton from '@/components/MyButton'
import { Home, MessageSquareText, Bookmark } from 'lucide-react'

import { useQueryClient } from '@tanstack/react-query'
import HeaderLoadingState from '@/components/layout/Header/components/HeaderLoadingState'
import { useCurrentUser, useMyProfile } from '@/apis/user/user.query'
import { userKeys } from '@/apis/user/user.key'
import authApi from '@/apis/auth/auth.api'
import NotificationButton from '@/components/notifications/NotificationButton'
import { postsKeys } from '@/apis/posts/posts.key'
import { LAYOUT_ALT, LAYOUT_ASSET, NAV_LABEL } from '@/core/constants/layout.constant'
import { ROUTE, ROUTE_BUILDER } from '@/core/constants/route.constant'
import { useUnreadMessagesCount } from '@/apis/messages/messages.query'
import { useMessagesRealtime } from '@/hooks/useMessagesRealtime'
import { loadCatalog } from '@/translations/clientI18n'
import { i18n } from '@lingui/core'
import { useLingui } from '@lingui/react/macro'

const Header = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { data: user, isLoading: isUserLoading } = useCurrentUser()
    const { data: profileData, isLoading: isProfileLoading } = useMyProfile(!!user)
    const { data: unreadMessagesCount = 0 } = useUnreadMessagesCount(!!user)
    useMessagesRealtime(!!user)
    const [languageLabel, setlanguageLabel] = useState('vi')
    const { t } = useLingui()
    const toggleLocale = async () => {
        const nextLocale = languageLabel === 'en' ? 'vi' : 'en'
        setlanguageLabel(nextLocale)
        const messages = await loadCatalog(nextLocale)
        i18n.loadAndActivate({ locale: nextLocale, messages })
    }

    const isPageLoading = isUserLoading || (!!user && isProfileLoading)
    const queryClient = useQueryClient()
    const profile = profileData ?? null

    const handleSignOut = async () => {
        const currentUserId = user?.id
        await authApi.logoutAccount()
        await queryClient.setQueryData(userKeys.currentUser(), null)
        await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
        if (pathname === ROUTE.PROFILE && currentUserId) {
            router.replace(ROUTE_BUILDER.profileDetail(currentUserId))
            return
        }
        router.replace(ROUTE.ROOT)
    }

    if (!mounted || isPageLoading) {
        return <HeaderLoadingState />
    }

    return (
        <header className="sticky top-0 z-40 mx-auto w-full max-w-[1180px] bg-white/95 backdrop-blur-sm">
            <div className="relative container mx-auto flex h-14 items-center justify-between px-3 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-gray-200">
                {/* ── Mobile: hamburger ── */}
                <div className="lg:hidden">
                    <MobileDrawer user={user} profile={profile} logOut={handleSignOut} />
                </div>

                {/* ── Desktop trái: Logo + Search ── */}
                <div className="hidden items-center gap-x-3 lg:flex">
                    <button type="button" onClick={() => router.push(ROUTE.HOME)} className="shrink-0 cursor-pointer">
                        <div className="bg-primary flex size-9 items-center justify-center rounded-[10px]">
                            <img
                                src={LAYOUT_ASSET.LOGO}
                                alt={LAYOUT_ALT.LOGO}
                                className="h-1/2 w-[13px] object-cover"
                            />
                        </div>
                    </button>
                    <SearchInput desktopOnly={true} />
                </div>

                {/* ── Mobile giữa: Search + Avatar ── */}
                <div className="flex items-center lg:hidden">
                    <SearchInput mobileOnly={true} />
                    {user && (
                        <Link href={ROUTE.PROFILE} className="ml-1 block">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile?.avatar_url}
                                    alt={LAYOUT_ALT.AVATAR}
                                    className="size-9 rounded-full object-cover ring-2 ring-transparent"
                                />
                            ) : (
                                <div className="flex size-9 items-center justify-center rounded-full bg-gray-300" />
                            )}
                        </Link>
                    )}
                </div>

                {/* ── Desktop phải: Nav + Bell + Avatar ── */}
                <div className="hidden h-full items-center lg:flex">
                    {user && (
                        <>
                            {/* Nav icons */}
                            <NavSection isDesktop={true}>
                                <NavItem icon={Home} isDesktop={true} href={ROUTE.HOME} />
                                <div className="relative flex h-full items-center">
                                    <NavItem icon={MessageSquareText} isDesktop={true} href={ROUTE.MESSAGES} />
                                    {unreadMessagesCount > 0 && (
                                        <span className="pointer-events-none absolute top-2 right-1 flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                            {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                                        </span>
                                    )}
                                </div>
                                <NavItem icon={Bookmark} isDesktop={true} href={ROUTE.BOOKMARK} />
                            </NavSection>

                            {/* Divider */}
                            <span className="mx-3 h-6 w-px bg-gray-200" />

                            {/* Bell */}
                            <NotificationButton enabled={!!user} />

                            {/* Divider */}
                            <span className="mx-3 h-6 w-px bg-gray-200" />
                        </>
                    )}

                    {/* Avatar dropdown hoặc Sign in/up */}
                    {user ? (
                        <div
                            onMouseEnter={() => setIsAvatarMenuOpen(true)}
                            onMouseLeave={() => setIsAvatarMenuOpen(false)}
                        >
                            <DropdownMenu modal={false} open={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="group relative cursor-pointer outline-none">
                                        {profile?.avatar_url ? (
                                            <img
                                                src={profile?.avatar_url}
                                                alt={LAYOUT_ALT.AVATAR}
                                                className="group-hover:ring-primary size-9 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-offset-2"
                                            />
                                        ) : (
                                            <div className="flex size-9 items-center justify-center rounded-full bg-gray-300" />
                                        )}
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    sideOffset={2}
                                    className="mt-[11px] w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 pt-[11px] shadow-xl shadow-gray-200/60"
                                >
                                    <DropdownMenuItem
                                        asChild
                                        className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:bg-gray-50"
                                    >
                                        <Link href={ROUTE.PROFILE}>
                                            <svg
                                                className="group-hover:text-primary size-4 text-gray-400 transition-colors"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.8}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                                />
                                            </svg>
                                            {t(NAV_LABEL.PROFILE)}
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onSelect={(event) => {
                                            event.preventDefault()
                                            toggleLocale()
                                        }}
                                        className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:bg-gray-50"
                                    >
                                        <svg
                                            className="group-hover:text-primary size-4 text-gray-400 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                                            />
                                        </svg>
                                        {languageLabel === 'en' ? 'English' : 'Tiếng Việt'}
                                    </DropdownMenuItem>

                                    <div className="my-1 h-px bg-gray-100" />

                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 focus:bg-red-50"
                                    >
                                        <svg
                                            className="size-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                            />
                                        </svg>
                                        {t(NAV_LABEL.SIGN_OUT)}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-x-3">
                            <MyButton href={ROUTE.REGISTER} name={t(NAV_LABEL.SIGN_UP)} />
                            <MyButton href={ROUTE.LOGIN} name={t(NAV_LABEL.LOG_IN)} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
