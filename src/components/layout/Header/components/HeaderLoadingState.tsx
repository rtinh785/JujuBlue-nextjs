import { Skeleton } from '@/components/base/skeleton'

const HeaderLoadingState = () => {
    return (
        <header className="sticky top-0 z-40 mx-auto w-full max-w-[1180px] bg-white/95 backdrop-blur-sm">
            <div className="relative container mx-auto flex h-14 items-center justify-between px-3 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-gray-200">
                {/* Mobile: hamburger */}
                <div className="lg:hidden">
                    <Skeleton className="size-9 rounded-lg" />
                </div>

                {/* Desktop trái: Logo + Search */}
                <div className="hidden items-center gap-x-3 lg:flex">
                    <Skeleton className="size-9 rounded-[10px]" />
                    <Skeleton className="h-9 w-52 rounded-xl" />
                </div>

                {/* Mobile: Search + Avatar */}
                <div className="flex items-center gap-2 lg:hidden">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="size-9 rounded-full" />
                </div>

                {/* Desktop phải: Nav icons + Divider + Bell + Divider + Avatar */}
                <div className="hidden items-center gap-x-1 lg:flex lg:gap-x-3">
                    <Skeleton className="size-9 rounded-lg" />
                    <Skeleton className="size-9 rounded-lg" />
                    <Skeleton className="size-9 rounded-lg" />

                    <span className="mx-3 h-6 w-px bg-gray-200" />

                    <Skeleton className="size-9 rounded-full" />

                    <span className="mx-3 h-6 w-px bg-gray-200" />

                    <Skeleton className="size-9 rounded-full" />
                </div>
            </div>
        </header>
    )
}

export default HeaderLoadingState
