export type PostMediaItem = {
    url: string
    type: 'image' | 'video'
}

type PostAuthor = {
    id: string
    username: string
    avatar_url: string
    display_name: string
}

export type Post = {
    id: string
    content: string
    media: PostMediaItem[] | null
    visibility: 'public' | 'followers' | 'private'
    parent_post_id: string | null
    root_post_id: string | null
    depth: number
    likes_count: number
    comments_count: number
    created_at: string
    updated_at: string
    author: PostAuthor
}

export type PostWithStatus = Post & {
    is_liked: boolean
    is_bookmark: boolean
}

export type FeedPosts = PostWithStatus[]

export type MessPostRes = {
    message: string
}

export type GetPostCountsRes = {
    postsCount: number
}

export type CommentItem = PostWithStatus & {
    replies: PostWithStatus[]
}

export type GetCommentsRes = {
    comments: CommentItem[]
}

export type CreateCommentReq = {
    content?: string
    media?: unknown[] | null
    parentPostId?: string
}

export type CreateCommentRes = {
    comment: PostWithStatus
}
