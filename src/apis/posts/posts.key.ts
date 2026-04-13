export const postsKeys = {
    all: () => ['posts'] as const,
    feed: () => ['posts', 'feed'] as const,
    profile: (userId: string) => ['posts', 'profile', userId] as const,
}
