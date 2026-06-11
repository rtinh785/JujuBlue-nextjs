import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@/components/base/dialog'
import NavItem from '@/components/layout/NavItem'
import NavSection from '@/components/layout/NavSection'
import { Profile } from '@/modules/Profile/profile.type'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { EarthLockIcon } from 'lucide-react'
import { LAYOUT_ALT, LAYOUT_ASSET, NAV_LABEL } from '@/core/constants/layout.constant'
import { ROUTE } from '@/core/constants/route.constant'
import { useCurrentLocale } from '@/hooks/useCurrentLocale'
interface MobileDrawerProps {
    user: User | undefined
    profile: Profile | null
    logOut: () => Promise<void>
}

const MobileDrawer = ({ user, profile, logOut }: MobileDrawerProps) => {
    const { languageLabel, toggleLocale } = useCurrentLocale()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <img src={LAYOUT_ASSET.MENU} alt={LAYOUT_ALT.OPEN_MENU} className="size-9 cursor-pointer lg:hidden" />
            </DialogTrigger>

            <DialogContent
                showCloseButton={false}
                className="data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left top-0 left-0 flex h-screen w-[78%] max-w-[280px] translate-x-0 translate-y-0 flex-col rounded-none border-none bg-white p-0 shadow-2xl duration-300 ease-out"
            >
                <DialogTitle className="sr-only">{NAV_LABEL.NAVIGATION_TITLE}</DialogTitle>
                <div className="flex items-center justify-between px-4 pt-5 pb-4">
                    <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                        {NAV_LABEL.NAVIGATION_TITLE}
                    </span>
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        >
                            <img src={LAYOUT_ASSET.CLOSE} alt={LAYOUT_ALT.CLOSE} />
                        </button>
                    </DialogClose>
                </div>
                {/* User card */}
                {user && (
                    <div className="mx-3 mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
                        {profile?.avatar_url ? (
                            <img
                                src={profile?.avatar_url}
                                alt={LAYOUT_ALT.AVATAR}
                                className="group-hover:ring-primary size-10 rounded-full object-cover ring-2 ring-transparent transition-all duration-200 group-hover:ring-offset-2"
                            />
                        ) : (
                            <div className="flex size-10 items-center justify-center rounded-full bg-gray-300" />
                        )}
                        <div className="min-w-0 flex-1">
                            <DialogClose asChild>
                                <Link href={ROUTE.PROFILE} className="block">
                                    <p className="truncate text-[13px] font-semibold text-gray-900">
                                        {NAV_LABEL.MY_ACCOUNT}
                                    </p>
                                    <p className="text-[11px] text-gray-400">{NAV_LABEL.VIEW_PROFILE}</p>
                                </Link>
                            </DialogClose>
                        </div>
                    </div>
                )}
                {/* Nav section */}

                <NavSection title={NAV_LABEL.MENU_SECTION}>
                    <DialogClose asChild>
                        <Link
                            href={ROUTE.HOME}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                        >
                            <img src={LAYOUT_ASSET.HOME} alt={LAYOUT_ALT.HOME} />
                            {NAV_LABEL.HOME}
                        </Link>
                    </DialogClose>

                    {user && (
                        <DialogClose asChild>
                            <Link
                                href={ROUTE.MESSAGES}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                            >
                                <img src={LAYOUT_ASSET.MESSAGE} alt={LAYOUT_ALT.MESSAGES} />
                                {NAV_LABEL.MESSAGES}
                            </Link>
                        </DialogClose>
                    )}
                </NavSection>
                {/* Divider */}
                <div className="mx-3 my-3 border-t border-gray-100" />
                {/* Settings section */}
                <NavSection title={NAV_LABEL.SETTINGS_SECTION}>
                    <NavItem icon={EarthLockIcon} label={languageLabel} onClick={toggleLocale} />
                </NavSection>
                {/* Spacer */}
                <div className="flex-1" />
                {/* Footer */}
                {user && (
                    <div className="border-t border-gray-100 px-5 py-4">
                        <button
                            type="button"
                            onClick={() => logOut()}
                            className="flex w-full items-center gap-2.5 text-[13px] font-medium text-red-400 transition-colors hover:text-red-600"
                        >
                            <img src={LAYOUT_ASSET.LOG_OUT} alt={LAYOUT_ALT.SIGN_OUT} />
                            {NAV_LABEL.SIGN_OUT}
                        </button>
                    </div>
                )}
                {!user && (
                    <div className="px-4 pb-6">
                        <div className="space-y-3">
                            <DialogClose asChild>
                                <Link
                                    href={ROUTE.LOGIN}
                                    className="block rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                                >
                                    {NAV_LABEL.LOG_IN}
                                </Link>
                            </DialogClose>
                            <DialogClose asChild>
                                <Link
                                    href={ROUTE.REGISTER}
                                    className="block rounded-full bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    {NAV_LABEL.SIGN_UP}
                                </Link>
                            </DialogClose>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default MobileDrawer
