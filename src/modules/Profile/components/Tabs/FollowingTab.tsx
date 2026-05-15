'use client'

import { useState } from 'react'
import { useFollowingList, useUnfollow } from '@/apis/follows/follows.query'
import ConfirmActionDialog from '@/components/common/ConfirmActionDialog'
import { PROFILE_ACTION_LABEL, PROFILE_DIALOG, PROFILE_TEXT } from '@/core/constants/profile.constant'
import { UserMinus } from 'lucide-react'
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
        if (!confirmId || isPending) return

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
                        <p className="text-sm font-medium text-slate-700">{PROFILE_TEXT.FOLLOWING_EMPTY_TITLE}</p>
                        <p className="mt-1 text-sm text-slate-400">{PROFILE_TEXT.FOLLOWING_EMPTY_DESCRIPTION}</p>
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
                                        {PROFILE_ACTION_LABEL.UNFOLLOW}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Confirm dialog dùng thư viện */}
            <ConfirmActionDialog
                open={!!confirmId}
                title={`${PROFILE_DIALOG.UNFOLLOW_TITLE_PREFIX} ${userToUnfollow?.display_name ?? PROFILE_TEXT.UNFOLLOW_TARGET_FALLBACK}?`}
                description={PROFILE_DIALOG.UNFOLLOW_DESCRIPTION}
                confirmText={PROFILE_DIALOG.UNFOLLOW_CONFIRM}
                loadingText={PROFILE_DIALOG.UNFOLLOW_LOADING}
                isLoading={isPending}
                icon={<UserMinus className="h-4 w-4 text-red-500" />}
                onOpenChange={(open) => {
                    if (!open) setConfirmId(null)
                }}
                onConfirm={handleUnfollow}
            />
        </>
    )
}

export default FollowingTab
