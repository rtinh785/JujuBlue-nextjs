import Stat from '@/components/home/Stat'
import { useFollowerCount, useFollowingCount } from '@/features/follows/follows.queries'
import { useMyProfile } from '@/features/profile/profile.queries'
import { User } from '@supabase/supabase-js'

import React from 'react'

const currentProfile = {
    name: 'Sarah Jenkins',
    handle: '@sjenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    following: '248',
    followers: '1.2k',
    posts: '89',
}

type ProfileSummaryCardProps = {
    user: User | undefined
}

const ProfileSummaryCard = ({ user }: ProfileSummaryCardProps) => {
    const { data: profileData } = useMyProfile(user?.id || '')
    const { data: followingCount } = useFollowingCount(user?.id)
    const { data: followerCount } = useFollowerCount(user?.id)
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
                {profileData?.avatar_url ? (
                    <img
                        src={profileData?.avatar_url}
                        alt={currentProfile.name}
                        className="size-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-gray-300" />
                )}

                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {profileData?.display_name || currentProfile.name}
                    </p>
                    <p className="text-xs text-slate-400">{profileData?.username || currentProfile.handle}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat value={followingCount ? followingCount.toString() : '0'} label="Following" />
                <Stat value={followerCount ? followerCount.toString() : '0'} label="Followers" />
                <Stat value="0" label="Posts" />
            </div>
        </section>
    )
}

export default ProfileSummaryCard
