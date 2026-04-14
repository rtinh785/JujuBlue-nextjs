import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import postsApi from './posts.api'
import { postsKeys } from './posts.key'

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.createPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
        },
    })
}

export const useFeedPosts = () => {
    return useQuery({
        queryKey: postsKeys.feed(),
        queryFn: async () => {
            const res = await postsApi.getFeed()
            return res.data
        },
    })
}

export const useProfilePosts = (userId?: string) => {
    return useQuery({
        queryKey: postsKeys.profile(userId ?? ''),
        queryFn: async () => {
            const res = await postsApi.getProfilePosts(userId ?? '')
            return res.data.posts
        },
        enabled: !!userId,
    })
}

export const useUploadPostMedia = () => {
    return useMutation({
        mutationFn: postsApi.uploadMedia,
    })
}
