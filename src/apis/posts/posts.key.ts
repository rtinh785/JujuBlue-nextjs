export const postsKeys = {
    all: () => ['posts'] as const,
    feed: () => ['posts', 'feed'] as const,
    feedInfinite: () => ['posts', 'feed', 'infinite'] as const,
    profileAll: () => ['posts', 'profile'] as const,
    profile: (userId: string) => ['posts', 'profile', userId] as const,
    detailAll: () => ['posts', 'detail'] as const,
    detail: (postId: string) => ['posts', 'detail', postId] as const,
    bookmarks: () => ['posts', 'bookmarks'] as const,
    comments: (postId: string) => ['posts', 'comments', postId] as const,
    postCounts: () => ['post-counts'] as const,
    trending: () => ['posts', 'trending'] as const,
}
