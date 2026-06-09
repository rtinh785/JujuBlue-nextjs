import userApi from '@/apis/user/user.api'
import { userKeys } from '@/apis/user/user.key'
import { ProfileUpdateData } from '@/core/types/request.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAccesTokenFromLS, getProfileFromLS } from '@/utils/auth'
import type { Profile } from '@/modules/Profile/profile.type'

const USER_CACHE_TIME = 1000 * 60 * 5

export const useCurrentUser = () => {
    const hasAccessToken = !!getAccesTokenFromLS()

    return useQuery({
        queryKey: userKeys.currentUser(),
        queryFn: async () => {
            const res = await userApi.me()
            return res.data.user
        },
        enabled: hasAccessToken,
        initialData: () => (hasAccessToken ? (getProfileFromLS() ?? undefined) : undefined),
        staleTime: USER_CACHE_TIME,
        retry: false,
    })
}

export const useMyProfile = (enabled = true) => {
    const hasAccessToken = !!getAccesTokenFromLS()

    return useQuery({
        queryKey: userKeys.myProfile(),
        queryFn: async () => {
            const res = await userApi.getMyProfile()
            return res.data.profile
        },
        enabled: hasAccessToken && enabled,
        retry: false,
    })
}

export const useUpdateMyProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: ProfileUpdateData) => {
            const res = await userApi.updateMyProfile(data)
            return res.data.profile
        },
        onSuccess: (profile) => {
            queryClient.setQueryData(userKeys.myProfile(), profile)
            void queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            void queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
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
        onSuccess: (profile) => {
            queryClient.setQueryData<Profile | undefined>(userKeys.myProfile(), (oldProfile) =>
                oldProfile
                    ? {
                          ...oldProfile,
                          avatar_url: profile.avatar_url,
                      }
                    : oldProfile,
            )
            void queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            void queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
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
        onSuccess: (profile) => {
            queryClient.setQueryData<Profile | undefined>(userKeys.myProfile(), (oldProfile) =>
                oldProfile
                    ? {
                          ...oldProfile,
                          cover_photo_url: profile.cover_photo_url,
                      }
                    : oldProfile,
            )
            void queryClient.invalidateQueries({ queryKey: userKeys.myProfile() })
            void queryClient.invalidateQueries({ queryKey: userKeys.currentUser() })
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
