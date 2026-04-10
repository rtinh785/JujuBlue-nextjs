'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/base/dialog'
import { useFollowingList, useUnfollow } from '@/apis/follows/follows.query'

interface FollowingTabProps {
    currentUserId?: string
    isOwnProfile?: boolean
}

const FollowingTab = ({ currentUserId, isOwnProfile = true }: FollowingTabProps) => {
    const [confirmId, setConfirmId] = useState<string | null>(null)

    const { data: following } = useFollowingList()
    const userToUnfollow = following?.find((u) => u.id === confirmId)
    const { mutateAsync: unfollowMutation, isPending } = useUnfollow(currentUserId)

    const handleUnfollow = async () => {
        if (!confirmId) return
        try {
            await unfollowMutation(confirmId)
            setConfirmId(null)
        } catch (error) {
            console.log('unfollow error:', error)
        }
    }

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                {following?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                            <svg
                                className="size-5 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6-4a2 2 0 11-4 0 2 2 0 014 0zM3 8a2 2 0 114 0A2 2 0 013 8z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Chưa follow ai</p>
                        <p className="mt-1 text-sm text-slate-400">Những người bạn follow sẽ xuất hiện ở đây.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {following?.map((user) => (
                            <li key={user.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar_url ?? ''}
                                        alt={user.display_name}
                                        className="size-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{user.display_name}</p>
                                        <p className="text-xs text-slate-400">@{user.username}</p>
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmId(user.id)}
                                        className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        Unfollow
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Confirm dialog dùng thư viện */}
            <Dialog
                open={!!confirmId}
                onOpenChange={(open) => {
                    if (!open) setConfirmId(null)
                }}
            >
                <DialogContent showCloseButton={false} className="gap-0 overflow-hidden px-4 pb-5">
                    <DialogHeader className="gap-3 p-6 pb-0">
                        <div className="flex size-11 items-center justify-center rounded-full bg-red-50">
                            <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <DialogTitle className="text-base font-semibold text-slate-900">
                                Bạn có chắc sẽ huỷ follow {userToUnfollow?.display_name}?
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <DialogFooter className="mt-6 border-t-0 pb-2">
                        <button
                            type="button"
                            onClick={() => handleUnfollow()}
                            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                            Unfollow
                        </button>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Huỷ
                            </button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FollowingTab
