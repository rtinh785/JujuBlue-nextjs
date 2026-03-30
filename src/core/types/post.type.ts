export type Post = {
    id: number
    author?: string
    handle?: string
    avatar?: string
    time: string
    content: string
    image?: string
    comments: number
    reposts: number
    likes: number
}
