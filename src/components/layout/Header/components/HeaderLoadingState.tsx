
import { Skeleton } from '@/components/base/skeleton'

const HeaderLoadingState = () => {

    return (
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm">
            <div className="relative container mx-auto flex items-center justify-between px-3 pt-3 pb-2 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-gray-200">
                {/* Mobile left: hamburger */}
                <div className="lg:hidden">
                    <Skeleton className="size-9 rounded-lg" />
                </div>

                {/* Desktop left: logo */}
                <div className="hidden items-center gap-x-2 lg:flex">
                    <Skeleton className="size-10 rounded-[12px]" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                </div>

                {/* Desktop center: search + nav */}
                <div className="hidden lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2 lg:items-center lg:gap-3">
                    <Skeleton className="h-9 w-[200px] rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                </div>

                {/* Mobile right: search + avatar */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-10 rounded-full" />
                </div>

                {/* Desktop right: avatar */}
                <div className="relative hidden lg:block">
                    <Skeleton className="size-10 rounded-full" />
                    <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-gray-200" />
                </div>
            </div>
        </header>
    )
}

export default HeaderLoadingState
