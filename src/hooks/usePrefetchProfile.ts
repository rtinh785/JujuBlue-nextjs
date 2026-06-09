import postsApi from '@/apis/posts/posts.api'
import { postsKeys } from '@/apis/posts/posts.key'
import userApi from '@/apis/user/user.api'
import { userKeys } from '@/apis/user/user.key'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const PROFILE_PREFETCH_STALE_TIME = 1000 * 60 * 5

export const usePrefetchProfile = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    return (userId?: string | null) => {
        if (!userId) return

        router.prefetch(ROUTE_BUILDER.profileDetail(userId))

        void queryClient.prefetchQuery({
            queryKey: userKeys.getProfile(userId),
            queryFn: async () => {
                const res = await userApi.getProfileById(userId)
                return res.data
            },
            staleTime: PROFILE_PREFETCH_STALE_TIME,
        })

        void queryClient.prefetchQuery({
            queryKey: postsKeys.profile(userId),
            queryFn: async () => {
                const res = await postsApi.getProfilePosts(userId)
                return res.data.posts
            },
            staleTime: PROFILE_PREFETCH_STALE_TIME,
        })
    }
}
