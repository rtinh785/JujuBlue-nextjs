'use client'

import { useNotificationGroupActors } from '@/apis/notifications/notifications.query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { Skeleton } from '@/components/base/skeleton'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import { useRouter } from 'next/navigation'

type Props = {
    groupKey: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const FollowGroupDialog = ({ groupKey, open, onOpenChange }: Props) => {
    const router = useRouter()
    const { data: actors = [], isLoading } = useNotificationGroupActors(open ? (groupKey ?? undefined) : undefined)

    const handleOpenProfile = (userId: string) => {
        onOpenChange(false)
        router.push(ROUTE_BUILDER.profileDetail(userId))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Recent followers</DialogTitle>
                </DialogHeader>

                <div className="max-h-[420px] overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    ) : actors.length > 0 ? (
                        <div className="space-y-1">
                            {actors.map((actor) => (
                                <button
                                    key={actor.id}
                                    type="button"
                                    onClick={() => handleOpenProfile(actor.id)}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                                >
                                    {actor.avatar_url ? (
                                        <img
                                            src={actor.avatar_url}
                                            alt={actor.display_name ?? 'Follower avatar'}
                                            className="size-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-10 rounded-full bg-slate-200" />
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {actor.display_name ?? 'Unknown user'}
                                        </p>
                                        {actor.username ? (
                                            <p className="truncate text-xs text-slate-400">@{actor.username}</p>
                                        ) : null}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-sm font-medium text-slate-600">No followers found</p>
                            <p className="mt-1 text-xs text-slate-400">This notification group may be outdated.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FollowGroupDialog
