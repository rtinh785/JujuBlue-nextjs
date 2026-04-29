'use client'
import ComposerCard from '@/components/home/ComposerCard/ComposerCard'
import PostCard from '@/components/post/PostCard'
import Aside from '@/components/layout/Header/components/Aside/Aside'
import { useCurrentUser } from '@/apis/user/user.query'
import { useFeedPosts } from '@/apis/posts/posts.query'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { PostWithStatus } from '@/core/types/post.type'
import { useState } from 'react'
const Home = () => {
    const { data: user } = useCurrentUser()
    const { data: feedPosts } = useFeedPosts()
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)
    const [shouldFocusComment, setShouldFocusComment] = useState(false)

    const handleOpenPostDetail = (post: PostWithStatus) => {
        setSelectedPost(post)
    }

    const handleOpenPostComments = (post: PostWithStatus) => {
        setSelectedPost(post)
        setShouldFocusComment(true)
    }

    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    {user && <ComposerCard />}

                    {/* list bai post */}
                    <div className="space-y-4">
                        {feedPosts?.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={user?.id}
                                onOpenDetail={handleOpenPostDetail}
                                onOpenComments={handleOpenPostComments}
                            />
                        ))}
                    </div>
                    {/* loading cac bai post */}
                    <div className="flex justify-center pt-2">
                        <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                </section>

                <Aside user={user} />
            </div>
            <PostDetailDialog
                post={selectedPost}
                currentUserId={user?.id}
                open={!!selectedPost}
                shouldFocusComment={shouldFocusComment}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPost(null)
                        setShouldFocusComment(false)
                    }
                }}
            />
        </main>
    )
}

export default Home
