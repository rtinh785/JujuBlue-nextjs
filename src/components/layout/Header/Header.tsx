'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

import { authKeys } from '@/features/auth/auth.keys'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from '@/features/auth/auth.api'
import { useMyProfile } from '@/features/profile/profile.queries'
import HeaderLoadingState from '@/modules/Login/components/HeaderLoadingState'
import { useCurrentUser } from '@/apis/user/user.query'

const Header = () => {
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
    const router = useRouter()
    const { data: user, isLoading: isUserLoading } = useCurrentUser()

    const { data: profileData, isLoading: isProfileLoading } = useMyProfile(user?.id || '')
    const isPageLoading = isUserLoading || (!!user && isProfileLoading)
    const queryClient = useQueryClient()
    const profile = profileData ?? null
    console.log(user)
    console.log('profile', profile)

    const handleSignOut = async () => {
        await signOut()
        await queryClient.setQueryData(authKeys.currentUser(), null)
    }

    if (isPageLoading) {
        return <HeaderLoadingState />
    }

    return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm">
            <div className="relative container mx-auto flex items-center justify-between px-3 pt-3 pb-2 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-gray-200">
                <div className="lg:hidden">
                    <MobileDrawer user={user} profile={profile} logOut={handleSignOut} />
                </div>

                <button
                    type="button"
                    onClick={() => router.push('/home')}
                    className="hidden cursor-pointer items-center gap-x-2 lg:flex"
                >
                    <div className="bg-primary flex size-10 items-center justify-center rounded-[12px] px-2 py-1">
                        <img
                            src="/images/svg/logo-new.svg"
                            alt="Juju Blue Logo"
                            className="h-1/2 w-[13px] fill-[#fff] object-cover"
                        />
                    </div>
                    <span className="text-primary text-2xl font-bold">Juju Blue</span>
                </button>

                <div className="hidden lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2">
                    <NavSection isDesktop={true}>
                        <SearchInput desktopOnly={true} />
                        {user && <NavItem isDesktop={true} label="Home" href="/home" />}
                        {user && <NavItem isDesktop={true} label="Messages" href="/messages" />}
                    </NavSection>
                </div>

                {/*  */}
                <div className="flex items-center lg:hidden">
                    <SearchInput mobileOnly={true} />
                    {user && (
                        <Link href="/profile" className="block">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile?.avatar_url}
                                    alt="Avatar"
                                    className="group-hover:ring-primary size-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-offset-2"
                                />
                            ) : (
                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-300" />
                            )}
                        </Link>
                    )}
                </div>

                <div
                    className="hidden lg:block"
                    onMouseEnter={() => setIsAvatarMenuOpen(true)}
                    onMouseLeave={() => setIsAvatarMenuOpen(false)}
                >
                    {user ? (
                        <DropdownMenu modal={false} open={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="group relative hidden cursor-pointer outline-none lg:block"
                                >
                                    {profile?.avatar_url ? (
                                        <img
                                            src={profile?.avatar_url}
                                            alt="Avatar"
                                            className="group-hover:ring-primary size-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-offset-2"
                                        />
                                    ) : (
                                        <div className="flex size-10 items-center justify-center rounded-full bg-gray-300" />
                                    )}
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={10}
                                className="w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-200/60"
                            >
                                <DropdownMenuItem
                                    asChild
                                    className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:bg-gray-50"
                                >
                                    <Link href="/profile">
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
                                        Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {}}
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
                                    Language
                                </DropdownMenuItem>

                                <div className="my-1 h-px bg-gray-100" />

                                <DropdownMenuItem
                                    onClick={() => handleSignOut()}
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
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-x-3">
                            <MyButton href="/register" name="Sign up" />
                            <MyButton href="/login" name="Log in" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
