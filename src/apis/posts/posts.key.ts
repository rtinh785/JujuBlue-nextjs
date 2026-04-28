export const postsKeys = {
    all: () => ['posts'] as const,
    feed: () => ['posts', 'feed'] as const,
    profile: (userId: string) => ['posts', 'profile', userId] as const,
    bookmarks: () => ['posts', 'bookmarks'] as const,
    comments: (postId: string) => ['posts', 'comments', postId] as const,
    postCounts: () => ['post-counts'] as const,
}
