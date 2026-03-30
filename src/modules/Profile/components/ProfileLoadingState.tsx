import { Skeleton } from '@/components/base/skeleton'

const ProfileLoadingState = () => {
    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="space-y-4 lg:pr-[344px]">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <Skeleton className="h-28 w-full sm:h-36" />
                    <div className="mt-4 flex items-end justify-between gap-4">
                        <Skeleton className="size-20 rounded-full sm:size-24" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-28 rounded-lg" />
                            <Skeleton className="h-10 w-28 rounded-lg" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-3">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ProfileLoadingState
