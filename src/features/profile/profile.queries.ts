import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile, UpdateProfilePayload } from './profile.api'
import { profileKeys } from './profile.keys'
import { Profile } from '@/modules/Profile/profile.type'

export const useMyProfile = (userId: string) => {
    return useQuery<Profile>({
        queryKey: profileKeys.myProfile(userId),
        queryFn: () => getMyProfile(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    })
}

export const useUpdateMyProfile = (userId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (profileData: UpdateProfilePayload) => updateMyProfile(userId, profileData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: profileKeys.myProfile(userId),
            })
        },
    })
}
