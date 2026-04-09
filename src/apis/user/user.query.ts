import userApi from '@/apis/user/user.api'
import { userKeys } from '@/apis/user/user.key'
import { ProfileUpdateData } from '@/core/types/request.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCurrentUser = () => {
    return useQuery({
        queryKey: userKeys.currentUser(),
        queryFn: async () => {
            const res = await userApi.me()
            return res.data.user
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useMyProfile = (enabled = true) => {
    return useQuery({
        queryKey: userKeys.myProfile(),
        queryFn: async () => {
            const res = await userApi.getMyProfile()
            return res.data
        },
        enabled,
    })
}

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: ProfileUpdateData) => {
            const res = await userApi.updateMyProfile(data)
            return res.data.profile
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            await queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
        },
    })
}

export const useUpdateAvatar = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: File) => {
            const res = await userApi.uploadAvatar(data)
            return res.data.profile
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            await queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
        },
    })
}

export const useUpdateCoverPhoto = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: File) => {
            const res = await userApi.uploadCoverPhoto(data)
            return res.data.profile
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            await queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
        },
    })
}

export const useGetProfile = (userId?: string) => {
    return useQuery({
        queryKey: userKeys.getProfile(userId ?? ''),
        queryFn: async () => {
            const res = await userApi.getProfileById(userId ?? '')
            return res.data
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!userId,
    })
}
