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

const Header = () => {
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
    const router = useRouter()

    return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm">
            <div className="relative container mx-auto flex items-center justify-between px-3 pt-3 pb-2 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-gray-200">
                <div className="lg:hidden">
                    <MobileDrawer />
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
                        <NavItem isDesktop={true} label="Home" href="/home" />
                        <NavItem isDesktop={true} label="Messages" href="/messages" />
                    </NavSection>
                </div>

                <div className="flex items-center lg:hidden">
                    <SearchInput mobileOnly={true} />
                    <Link href="/profile" className="block">
                        <img
                            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/596815475_10237514722319902_2803255483467207372_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=IFm2JmsOgUAQ7kNvwEfWRwy&_nc_oc=AdqR2cApAlI5RWuOsFMBs2XvLt8QC906lGmKVxDB4e0AeqeA9TcrKGhy2TamRawfquk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=wuVi5Fwr7n6OStbjA7AFFw&_nc_ss=7a32e&oh=00_Afxz40AlCpgJveyokwnX1NdS17tlb31Jsb4FEW4XgIZ1UA&oe=69CC193E"
                            alt="Avatar"
                            className="size-10 cursor-pointer rounded-full object-cover"
                        />
                    </Link>
                </div>

                <div
                    className="hidden lg:block"
                    onMouseEnter={() => setIsAvatarMenuOpen(true)}
                    onMouseLeave={() => setIsAvatarMenuOpen(false)}
                >
                    <DropdownMenu modal={false} open={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="group relative hidden cursor-pointer outline-none lg:block"
                            >
                                <img
                                    src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/596815475_10237514722319902_2803255483467207372_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=_Z1dCSNDGiwQ7kNvwGSVDWX&_nc_oc=AdqZNLMvyYIabXcyFAGgSrasoB0WdpbZJetvGUAw5Xn-DXJUJFBknKI4bLQbJr3NTfk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=6oI3w42pDk4Pvjcg2haIrw&_nc_ss=7a32e&oh=00_AfwvPu32dhKon0jtR5X2aA7AI8Xpn9nshO3jlcW7F5PX_A&oe=69CC89BE"
                                    alt="Avatar"
                                    className="group-hover:ring-primary size-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-offset-2"
                                />
                                <span className="bg-primary border-background absolute right-0 bottom-0 size-2.5 rounded-full border-2" />
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
                                onClick={() => {}}
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

                    {/* Guest desktop state
                    <div className="flex items-center gap-x-3">
                        <MyButton href="/register" name="Sign up" />
                        <MyButton href="/login" name="Log in" />
                    </div>
                    */}
                </div>
            </div>
        </header>
    )
}

export default Header
