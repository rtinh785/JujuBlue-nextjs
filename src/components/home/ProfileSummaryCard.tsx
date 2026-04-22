import { useFollowCounts } from '@/apis/follows/follows.query'
import { useGetPostCounts } from '@/apis/posts/posts.query'
import { useMyProfile } from '@/apis/user/user.query'
import Stat from '@/components/home/Stat'
import { User } from '@supabase/supabase-js'

type ProfileSummaryCardProps = {
    user: User | undefined
}

const ProfileSummaryCard = ({ user }: ProfileSummaryCardProps) => {
    const { data: profileData } = useMyProfile()
    const { data: followCounts } = useFollowCounts()
    const { data: postCounts } = useGetPostCounts()

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
                {profileData?.avatar_url ? (
                    <img
                        src={profileData?.avatar_url}
                        alt={profileData.display_name}
                        className="size-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-gray-300" />
                )}

                <div>
                    <p className="text-sm font-semibold text-slate-900">{profileData?.display_name}</p>
                    <p className="text-xs text-slate-400">{profileData?.username}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Stat value={followCounts ? followCounts.following.toString() : '0'} label="Following" />
                <Stat value={followCounts ? followCounts.followers.toString() : '0'} label="Followers" />
                <Stat value={postCounts ? postCounts.postsCount.toString() : '0'} label="Posts" />
            </div>
        </section>
    )
}

export default ProfileSummaryCard
