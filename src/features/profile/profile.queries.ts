import { useQuery } from '@tanstack/react-query'
import { getMyProfile } from './profile.api'
import { profileKeys } from './profile.keys'
import { Profile } from '@/modules/Profile/profile.type'

export const useMyProfile = (userId?: string) => {
    return useQuery<Profile>({
        queryKey: userId ? profileKeys.myProfile(userId) : ['my-profile', 'unknown'],
        queryFn: () => getMyProfile(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    })
}
