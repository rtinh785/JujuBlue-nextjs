'use client'

import { usePostById } from '@/apis/posts/posts.query'
import { useMyProfile } from '@/apis/user/user.query'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { ROUTE } from '@/core/constants/route.constant'
import { useRouter } from 'next/navigation'

type Props = {
    postId: string
}

const PostDetailRoute = ({ postId }: Props) => {
    const router = useRouter()
    const { data: post, isLoading, isError } = usePostById(postId)
    const { data: myProfile } = useMyProfile()

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            router.push(ROUTE.HOME)
        }
    }

    if (isLoading) {
        return <div className="py-10 text-center text-sm text-slate-500">Loading post...</div>
    }

    if (isError || !post) {
        return <div className="py-10 text-center text-sm text-slate-500">Post not found.</div>
    }

    return <PostDetailDialog post={post} currentUserId={myProfile?.id} open={true} onOpenChange={handleOpenChange} />
}

export default PostDetailRoute
