'use client'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/base/dialog'
import Link from 'next/link'

const Header = () => {
    return (
        <header className="flex items-center justify-between px-3 pt-3">
            <Dialog>
                <DialogTrigger asChild>
                    <img src="/images/svg/bar-menu.svg" alt="Open menu" className="size-9 cursor-pointer" />
                </DialogTrigger>

                <DialogContent
                    showCloseButton={false}
                    className="data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left top-0 left-0 flex h-screen w-[78%] max-w-[280px] translate-x-0 translate-y-0 flex-col rounded-none border-none bg-white p-0 shadow-2xl duration-300 ease-out"
                >
                    <DialogTitle className="sr-only">Navigation menu</DialogTitle>

                    <div className="flex items-center justify-between px-4 pt-5 pb-4">
                        <span className="text-[15px] font-semibold tracking-tight text-gray-900">Navigation</span>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                            >
                                <img src="/images/svg/x.svg" alt="Close" />
                            </button>
                        </DialogClose>
                    </div>

                    {/* User card */}
                    <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                        <img
                            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/596815475_10237514722319902_2803255483467207372_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=IFm2JmsOgUAQ7kNvwEfWRwy&_nc_oc=AdqR2cApAlI5RWuOsFMBs2XvLt8QC906lGmKVxDB4e0AeqeA9TcrKGhy2TamRawfquk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=wuVi5Fwr7n6OStbjA7AFFw&_nc_ss=7a32e&oh=00_Afxz40AlCpgJveyokwnX1NdS17tlb31Jsb4FEW4XgIZ1UA&oe=69CC193E"
                            alt="avatar"
                            className="size-9 rounded-full object-cover ring-2 ring-white"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-gray-900">My Account</p>
                            <p className="text-[11px] text-gray-400">View profile</p>
                        </div>
                    </div>

                    {/* Nav section */}
                    <div className="px-3">
                        <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            Menu
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                            >
                                <img src="/images/svg/home.svg" alt="Home" />
                                Home
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                            >
                                <img src="/images/svg/message.svg" alt="Messages" />
                                Messages
                            </Link>
                        </nav>
                    </div>

                    {/* Divider */}
                    <div className="mx-3 my-3 border-t border-gray-100" />

                    {/* Settings section */}
                    <div className="px-3">
                        <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            Settings
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            <button
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                            >
                                <img src="/images/svg/earth.svg" alt="Language" />
                                Language
                            </button>
                        </nav>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-5 py-4">
                        <button
                            type="button"
                            className="flex w-full items-center gap-2.5 text-[13px] font-medium text-red-400 transition-colors hover:text-red-600"
                        >
                            <img src="/images/svg/log-out.svg" alt="Sign out" />
                            Sign out
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="relative mx-3 max-w-[200px] flex-1">
                <img
                    src="/images/svg/search.svg"
                    alt="Search"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <input
                    type="text"
                    placeholder="Search"
                    className="h-9 w-full rounded-full border border-gray-300 bg-white pr-3 pl-10 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
                />
            </div>

            <img
                src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/596815475_10237514722319902_2803255483467207372_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=IFm2JmsOgUAQ7kNvwEfWRwy&_nc_oc=AdqR2cApAlI5RWuOsFMBs2XvLt8QC906lGmKVxDB4e0AeqeA9TcrKGhy2TamRawfquk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=wuVi5Fwr7n6OStbjA7AFFw&_nc_ss=7a32e&oh=00_Afxz40AlCpgJveyokwnX1NdS17tlb31Jsb4FEW4XgIZ1UA&oe=69CC193E"
                alt=""
                className="size-10 cursor-pointer rounded-full"
            />
        </header>
    )
}

export default Header
