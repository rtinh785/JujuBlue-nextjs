import PostDetailRoute from '@/modules/PostDetailRoute/PostDetailRoute'

type Props = {
    params: Promise<{
        id: string
    }>
}

const PostDetailPage = async ({ params }: Props) => {
    const { id } = await params

    return <PostDetailRoute postId={id} />
}

export default PostDetailPage
