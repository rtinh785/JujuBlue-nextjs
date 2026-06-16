import { useFollowCounts } from '@/apis/follows/follows.query'
import { useGetPostCounts } from '@/apis/posts/posts.query'
import { useMyProfile } from '@/apis/user/user.query'
import Stat from '@/components/layout/Header/components/Aside/components/Stat'
import { ASIDE_STAT_LABEL, LAYOUT_ALT } from '@/core/constants/layout.constant'
import { useLingui } from '@lingui/react/macro'

const ProfileSummaryCard = () => {
    const { data: profileData } = useMyProfile()
    const { data: followCounts } = useFollowCounts()
    const { data: postCounts } = useGetPostCounts()
    const { t } = useLingui()
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
                {profileData?.avatar_url ? (
                    <img
                        src={profileData?.avatar_url}
                        alt={profileData.display_name || LAYOUT_ALT.AVATAR}
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
                <Stat
                    value={followCounts ? followCounts.following.toString() : '0'}
                    label={t(ASIDE_STAT_LABEL.FOLLOWING)}
                />
                <Stat
                    value={followCounts ? followCounts.followers.toString() : '0'}
                    label={t(ASIDE_STAT_LABEL.FOLLOWERS)}
                />
                <Stat value={postCounts ? postCounts.postsCount.toString() : '0'} label={t(ASIDE_STAT_LABEL.POSTS)} />
            </div>
        </section>
    )
}

export default ProfileSummaryCard
