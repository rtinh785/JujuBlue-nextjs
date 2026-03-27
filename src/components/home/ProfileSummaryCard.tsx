import Stat from '@/components/home/Stat'
import React from 'react'

const currentProfile = {
    name: 'Sarah Jenkins',
    handle: '@sjenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    following: '248',
    followers: '1.2k',
    posts: '89',
}

const ProfileSummaryCard = () => {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
                <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="size-11 rounded-full object-cover"
                />
                <div>
                    <p className="text-sm font-semibold text-slate-900">{currentProfile.name}</p>
                    <p className="text-xs text-slate-400">{currentProfile.handle}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat value={currentProfile.following} label="Following" />
                <Stat value={currentProfile.followers} label="Followers" />
                <Stat value={currentProfile.posts} label="Posts" />
            </div>
        </section>
    )
}

export default ProfileSummaryCard
