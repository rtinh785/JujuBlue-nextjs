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
