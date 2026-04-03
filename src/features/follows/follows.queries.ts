import {
    checkIsFollowing,
    followUser,
    getFollowerCount,
    getFollowingProfiles,
    getFollowingCount,
    unfollowUser,
} from '@/features/follows/follows.api'
import { followerKeys } from '@/features/follows/follows.keys'
import { profileKeys } from '@/features/profile/profile.keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useFollowUser = (userId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (following: string) => followUser(userId!, following),
        onSuccess: async (_, following) => {
            await queryClient.invalidateQueries({
                queryKey: followerKeys.currentUser(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: profileKeys.suggestedProfiles(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followingCount(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followerCount(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.isFollowing(userId!, following),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followingProfiles(userId!),
            })
        },
    })
}

export const useFollowingCount = (userId?: string) => {
    return useQuery({
        queryKey: followerKeys.followingCount(userId ?? 'guest'),
        queryFn: () => getFollowingCount(userId!),
        enabled: !!userId,
        staleTime: 1000 * 30,
    })
}

export const useFollowerCount = (userId?: string) => {
    return useQuery({
        queryKey: followerKeys.followerCount(userId!),
        queryFn: () => getFollowerCount(userId!),
        enabled: !!userId,
        staleTime: 1000 * 30,
    })
}

export const useUnfollowUser = (userId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (following: string) => unfollowUser(userId!, following),
        onSuccess: async (_, following) => {
            await queryClient.invalidateQueries({
                queryKey: followerKeys.currentUser(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: profileKeys.suggestedProfiles(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followingCount(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followerCount(userId!),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.isFollowing(userId!, following),
            })
            await queryClient.invalidateQueries({
                queryKey: followerKeys.followingProfiles(userId!),
            })
        },
    })
}

export const useCheckIsFollowing = (followerId?: string, followingId?: string) => {
    return useQuery({
        queryKey: followerKeys.isFollowing(followerId!, followingId!),
        queryFn: () => checkIsFollowing(followerId!, followingId!),
        enabled: !!followerId && !!followingId,
        staleTime: 1000 * 30,
    })
}

export const useFollowingProfiles = (userId?: string) => {
    return useQuery({
        queryKey: followerKeys.followingProfiles(userId ?? 'guest'),
        queryFn: () => getFollowingProfiles(userId!),
        enabled: !!userId,
        staleTime: 1000 * 30,
    })
}
