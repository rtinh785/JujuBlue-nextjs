export const userKeys = {
    currentUser: () => ['current-user'] as const,
    myProfile: () => ['my-profile'] as const,
    getProfile: (userId: string) => ['get-profile', userId] as const,
}
