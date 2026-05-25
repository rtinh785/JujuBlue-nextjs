import type { PostWithStatus } from '@/core/types/post.type'

export const getTrendingPostTitle = (post: PostWithStatus) => {
    const content = post.content?.trim()

    if (content) {
        const words = content.split(/\s+/)

        return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : content
    }

    if (post.author?.display_name) {
        return `Post by ${post.author.display_name}`
    }

    return 'Untitled post'
}

export const getPostInteractions = (post: PostWithStatus) => {
    return (post.likes_count ?? 0) + (post.comments_count ?? 0) + (post.shares_count ?? 0)
}
