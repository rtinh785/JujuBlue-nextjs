import ProfileSummaryCard from '@/components/layout/Header/components/Aside/components/ProfileSummaryCard'
import SuggestedUsersCard from '@/components/layout/Header/components/Aside/components/SuggestedUsersCard'
import TrendingCard from '@/components/layout/Header/components/Aside/components/TrendingCard'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { ASIDE_TEXT } from '@/core/constants/layout.constant'
import { PostWithStatus } from '@/core/types/post.type'
import { User } from '@supabase/supabase-js'
import { useState } from 'react'

interface AsideProps {
    showTrending?: boolean
    user: User | undefined
}

const Aside = ({ showTrending = true, user }: AsideProps) => {
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)
    return (
        <>
            <aside className="hidden space-y-4 lg:fixed lg:top-[88px] lg:right-[max(1rem,calc((100vw-1180px)/2+1rem))] lg:block lg:h-[calc(100vh-108px)] lg:w-[320px] lg:overflow-y-auto lg:pr-1">
                {user && <ProfileSummaryCard />}
                {showTrending && <TrendingCard onOpenPost={setSelectedPost} />}
                {user && <SuggestedUsersCard user={user} />}

                <div className="px-1 text-xs text-slate-400">
                    <p>{ASIDE_TEXT.TERMS}</p>
                    <p className="mt-1">{ASIDE_TEXT.COPYRIGHT}</p>
                </div>
            </aside>
            <PostDetailDialog
                post={selectedPost}
                currentUserId={user?.id}
                open={!!selectedPost}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPost(null)
                    }
                }}
                onDeleted={() => {
                    setSelectedPost(null)
                }}
            />
        </>
    )
}

export default Aside
