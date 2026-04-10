export const followsKeys = {
    suggestedProfiles: () => ['suggested-profiles'] as const,
    checkIsFollowing: (currentUserId: string, followingUserId: string) =>
        ['checkFollowing', currentUserId, followingUserId] as const,
    followCounts: () => ['follow-counts'] as const,
    followingList: () => ['following-list'] as const,
}
