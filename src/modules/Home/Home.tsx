'use client'
import ComposerCard from '@/components/home/ComposerCard/ComposerCard'
import PostCard from '@/components/post/PostCard'
import Aside from '@/components/layout/Header/components/Aside/Aside'
import { useCurrentUser } from '@/apis/user/user.query'
import { useInfiniteFeedPosts } from '@/apis/posts/posts.query'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { PostWithStatus } from '@/core/types/post.type'
import { useMemo, useState } from 'react'
import { useInfiniteScrollTrigger } from '@/hooks/useInfiniteScrollTrigger'
import { useLocale } from '@/contexts/LocaleContext'

const Home = () => {
    const { data: user } = useCurrentUser()
   
    const { data: feedPostsPages, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFeedPosts()
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)
    const [shouldFocusComment, setShouldFocusComment] = useState(false)
    const { loadMoreTriggerRef } = useInfiniteScrollTrigger({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage: () => {
            void fetchNextPage()
        },
    })

    const feedPosts = useMemo(() => feedPostsPages?.pages.flatMap((page) => page.posts) ?? [], [feedPostsPages])

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
                        {feedPosts.map((post) => (
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
                    {isLoading && feedPosts.length === 0 ? (
                        <div className="flex justify-center pt-2">
                            <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                        </div>
                    ) : null}

                    {hasNextPage ? (
                        <div ref={loadMoreTriggerRef} className="flex min-h-12 justify-center pt-2">
                            {isFetchingNextPage ? (
                                <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                            ) : null}
                        </div>
                    ) : null}
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
                onDeleted={() => {
                    setSelectedPost(null)
                }}
            />
        </main>
    )
}

export default Home
