'use client'
import { useFollow, useSuggestedProfiles } from '@/apis/follows/follows.query'
import { ASIDE_ACTION_LABEL, ASIDE_TEXT, LAYOUT_ALT } from '@/core/constants/layout.constant'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import React from 'react'

type SuggestedUsersCardProps = {
    user: User | undefined
}

const SuggestedUsersCard = ({ user }: SuggestedUsersCardProps) => {
    const { data: suggestedUsersArray } = useSuggestedProfiles()
    const { mutate: followMutation } = useFollow(user?.id)

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">{ASIDE_TEXT.WHO_TO_FOLLOW}</h2>

            <div className="mt-4 space-y-4">
                {suggestedUsersArray?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                        <Link href={ROUTE_BUILDER.profileDetail(user.id)} className="flex items-center gap-3">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.display_name || LAYOUT_ALT.AVATAR}
                                    className="size-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-300" />
                            )}

                            <div>
                                <p className="text-sm font-semibold text-slate-900">{user.display_name}</p>
                                <p className="text-xs text-slate-400">{user.username}</p>
                            </div>
                        </Link>

                        <button
                            type="button"
                            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                            onClick={() => followMutation(user.id)}
                        >
                            {ASIDE_ACTION_LABEL.FOLLOW}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SuggestedUsersCard
