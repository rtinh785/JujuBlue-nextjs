import { followsApi } from '@/apis/follows/follows.api'
import { followsKeys } from '@/apis/follows/follows.key'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useSuggestedProfiles = () => {
    return useQuery({
        queryKey: followsKeys.suggestedProfiles(),
        queryFn: async () => {
            const res = await followsApi.getSuggestedProfiles()
            return res.data.profiles
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useFollow = (currentUserId?: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (followingUserId: string) => {
            const res = await followsApi.followUser(followingUserId)
            return res.data
        },
        onSuccess: async (_data, followingUserId: string) => {
            await queryClient.invalidateQueries({ queryKey: followsKeys.suggestedProfiles() })
            if (currentUserId) {
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.checkIsFollowing(currentUserId, followingUserId),
                })
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.followCounts(),
                })
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.followingList(),
                })
            }
        },
    })
}

export const useCheckFollowing = (currentUserId?: string, followingUserId?: string) => {
    return useQuery({
        queryKey: followsKeys.checkIsFollowing(currentUserId ?? '', followingUserId ?? ''),
        queryFn: async () => {
            const res = await followsApi.checkFollowing(followingUserId ?? '')
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!currentUserId && !!followingUserId,
    })
}

export const useUnfollow = (currentUserId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (followingUserId: string) => {
            const res = await followsApi.unfollowUser(followingUserId)
            return res.data
        },
        onSuccess: async (_data, followingUserId: string) => {
            await queryClient.invalidateQueries({ queryKey: followsKeys.suggestedProfiles() })

            if (currentUserId) {
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.checkIsFollowing(currentUserId, followingUserId),
                })
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.followCounts(),
                })
                await queryClient.invalidateQueries({
                    queryKey: followsKeys.followingList(),
                })
            }
        },
    })
}

export const useFollowCounts = () => {
    return useQuery({
        queryKey: followsKeys.followCounts(),
        queryFn: async () => {
            const res = await followsApi.getFollowCounts()
            return res.data
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useFollowingList = () => {
    return useQuery({
        queryKey: followsKeys.followingList(),
        queryFn: async () => {
            const res = await followsApi.getFollowing()
            return res.data.profiles
        },
        staleTime: 1000 * 60 * 5,
    })
}
