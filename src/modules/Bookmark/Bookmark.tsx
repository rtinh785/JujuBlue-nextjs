'use client'

import { useState } from 'react'
import Aside from '@/components/layout/Header/components/Aside/Aside'
import { useCurrentUser } from '@/apis/user/user.query'
import { useBookmarkedPosts } from '@/apis/posts/posts.query'
import BookmarkItem from './components/BookmarkItem'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { PostWithStatus } from '@/core/types/post.type'
import { useUnbookmarkPost } from '@/apis/posts/posts.query'
import ConfirmUnbookmarkDialog from '@/components/post/components/ConfirmUnbookmarkDialog'
import { BOOKMARK_TEXT } from '@/core/constants/bookmark.constant'
import { useLingui } from '@lingui/react/macro'


const Bookmark = () => {
    const { data: user } = useCurrentUser()
    const { t } = useLingui()

    const { data: bookmarkedPosts } = useBookmarkedPosts()
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)
    const [postToUnbookmark, setPostToUnbookmark] = useState<PostWithStatus | null>(null)
    const { mutateAsync: unbookmarkPost, isPending: isUnbookmarking } = useUnbookmarkPost()

    const handleOpenPostDetail = (post: PostWithStatus) => {
        setSelectedPost(post)
    }

    const handleRequestUnbookmark = (post: PostWithStatus) => {
        setPostToUnbookmark(post)
    }

    const handleConfirmUnbookmark = async () => {
        if (!postToUnbookmark || isUnbookmarking) return

        await unbookmarkPost(postToUnbookmark.id)
        setPostToUnbookmark(null)
    }
    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{t(BOOKMARK_TEXT.PAGE_TITLE)}</h1>
                        <p className="mt-1 text-sm text-slate-500">{t(BOOKMARK_TEXT.PAGE_DESCRIPTION)}</p>
                    </div>

                    <div className="space-y-3">
                        {bookmarkedPosts?.map((post) => (
                            <BookmarkItem
                                key={post.id}
                                post={post}
                                onOpenDetail={handleOpenPostDetail}
                                onRequestUnbookmark={handleRequestUnbookmark}
                            />
                        ))}
                    </div>
                </section>

                <Aside user={user} />
            </div>

            <PostDetailDialog
                post={selectedPost}
                currentUserId={user?.id}
                open={!!selectedPost}
                onOpenChange={(open) => {
                    if (!open) setSelectedPost(null)
                }}
            />

            <ConfirmUnbookmarkDialog
                post={postToUnbookmark}
                open={!!postToUnbookmark}
                isLoading={isUnbookmarking}
                onOpenChange={(open) => {
                    if (!open) setPostToUnbookmark(null)
                }}
                onConfirm={handleConfirmUnbookmark}
            />
        </main>
    )
}

export default Bookmark
