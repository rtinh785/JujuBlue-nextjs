'use client'

import { useFollowingProfiles, useUnfollowUser } from '@/features/follows/follows.queries'
import { useState } from 'react'

type FollowingTabProps = {
    profileId?: string
    currentUserId?: string
}

const FollowingTab = ({ profileId, currentUserId }: FollowingTabProps) => {
    const [confirmId, setConfirmId] = useState<string | null>(null)

    const { data: followingUsers = [], isLoading } = useFollowingProfiles(profileId)
    const { mutateAsync: unfollowMutation, isPending: isUnfollowing } = useUnfollowUser(currentUserId)

    const userToUnfollow = followingUsers.find((user) => user.id === confirmId)
    const canUnfollow = !!currentUserId && !!profileId && currentUserId === profileId

    const handleConfirmUnfollow = async () => {
        if (!confirmId) {
            return
        }

        try {
            await unfollowMutation(confirmId)
            setConfirmId(null)
        } catch (error) {
            console.log('unfollow error:', error)
        }
    }

    if (isLoading) {
        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="space-y-4 px-5 py-5">
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                {followingUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                            <svg className="size-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6-4a2 2 0 11-4 0 2 2 0 014 0zM3 8a2 2 0 114 0A2 2 0 013 8z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Chua follow ai</p>
                        <p className="mt-1 text-sm text-slate-400">Nhung nguoi ban follow se xuat hien o day.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {followingUsers.map((user) => (
                            <li key={user.id} className="flex items-center justify-between gap-4 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.display_name}
                                            className="size-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-10 rounded-full bg-slate-200" />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{user.display_name}</p>
                                        <p className="text-xs text-slate-400">@{user.username}</p>
                                    </div>
                                </div>

                                {canUnfollow ? (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmId(user.id)}
                                        className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Following
                                    </button>
                                ) : (
                                    <span className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-500">
                                        Following
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {confirmId && canUnfollow && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
                    onClick={() => setConfirmId(null)}
                >
                    <div
                        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-red-50">
                                <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-base font-semibold text-slate-900">
                                Unfollow {userToUnfollow?.display_name}?
                            </h2>
                            <p className="mt-1.5 text-sm text-slate-500">
                                Bai viet cua <span className="font-medium text-slate-700">@{userToUnfollow?.username}</span>{' '}
                                se khong con xuat hien trong feed cua ban nua.
                            </p>
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setConfirmId(null)}
                                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Huy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUnfollow}
                                disabled={isUnfollowing}
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                            >
                                {isUnfollowing ? 'Dang xu ly...' : 'Unfollow'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FollowingTab
