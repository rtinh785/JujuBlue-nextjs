'use client'
import { useFollow, useSuggestedProfiles } from '@/apis/follows/follows.query'
import { User } from '@supabase/supabase-js'
import Link from 'next/dist/client/link'
import React from 'react'

type SuggestedUsersCardProps = {
    user: User | undefined
}

const SuggestedUsersCard = ({ user }: SuggestedUsersCardProps) => {
    const { data: suggestedUsersArray } = useSuggestedProfiles()
    const { mutate: followMutation } = useFollow(user?.id)

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">Who to follow</h2>

            <div className="mt-4 space-y-4">
                {suggestedUsersArray?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                        <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.display_name}
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
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SuggestedUsersCard
