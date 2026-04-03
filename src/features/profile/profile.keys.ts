export const profileKeys = {
    myProfile: (userId: string) => ['my-profile', userId] as const,
    suggestedProfiles: (userId?: string) => ['suggested-profiles', userId] as const,
}
