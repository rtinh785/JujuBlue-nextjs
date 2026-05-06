'use client'

import { useProfilePosts } from '@/apis/posts/posts.query'
import PostCard from '@/components/post/PostCard'
import { PostWithStatus } from '@/core/types/post.type'

type Props = {
    profileId?: string
    currentUserId?: string
    onOpenDetail?: (post: PostWithStatus) => void
    onOpenComments?: (post: PostWithStatus) => void
}

const PostsTab = ({ profileId, currentUserId, onOpenDetail, onOpenComments }: Props) => {
    const { data: posts, isLoading } = useProfilePosts(profileId)

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <p className="text-sm font-medium text-slate-700">Chưa có bài viết nào</p>
                <p className="mt-1 text-sm text-slate-400">Các bài viết của người dùng này sẽ xuất hiện ở đây.</p>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            {posts.map((post: PostWithStatus) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onOpenDetail={onOpenDetail}
                    onOpenComments={onOpenComments}
                />
            ))}
        </section>
    )
}

export default PostsTab
