import type { PostVisibility } from '@/core/constants/post.constant'

export type PostMediaItem = {
    url: string
    type: 'image' | 'video'
}

type PostAuthor = {
    id: string
    username: string
    avatar_url: string | null
    display_name: string
}

export type SharedPostItem = {
    id: string
    content: string | null
    media: PostMediaItem[] | null
    visibility: PostVisibility | null
    parent_post_id?: string | null
    root_post_id?: string | null
    depth?: number | null
    likes_count?: number | null
    comments_count?: number | null
    shares_count?: number | null
    shared_post_id?: string | null
    was_shared_post?: boolean
    created_at?: string | null
    updated_at?: string | null
    author: PostAuthor
    is_liked?: boolean
    is_bookmark?: boolean
}

export type Post = {
    id: string
    content: string
    media: PostMediaItem[] | null
    visibility: PostVisibility
    parent_post_id: string | null
    root_post_id: string | null
    depth: number
    likes_count: number
    comments_count: number
    shared_post_id: string | null
    was_shared_post: boolean
    shares_count: number
    created_at: string
    updated_at: string
    author: PostAuthor
}

export type PostWithStatus = Post & {
    is_liked: boolean
    is_bookmark: boolean
    shared_post?: SharedPostItem | null
}

export type FeedPosts = PostWithStatus[]

export type GetFeedPostsRes = {
    posts: PostWithStatus[]
    nextCursor: string | null
    hasMore: boolean
}

export type CreatePostReq = {
    content?: string
    media?: PostMediaItem[] | null
    visibility: PostVisibility
}

export type GetProfilePostsRes = {
    posts: PostWithStatus[]
}

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
    media?: PostMediaItem[] | null
    parentPostId?: string
}

export type CreateCommentRes = {
    comment: PostWithStatus
}

export type UpdatePostReq = {
    content?: string
    visibility?: PostVisibility
    media?: PostMediaItem[] | null
}

export type UpdatePostRes = {
    message: string
    post: PostWithStatus
}

export type DeletePostRes = {
    message: string
    deletedCount: number
}

export type GetPostByIdRes = {
    post: PostWithStatus
}

export type SharePostReq = {
    content?: string
    visibility?: PostVisibility
}

export type SharePostRes = {
    message: string
    post: PostWithStatus
}

export type GetTrendingPostsRes = {
    posts: PostWithStatus[]
}
