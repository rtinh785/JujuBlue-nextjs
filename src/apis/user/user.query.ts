import userApi from '@/apis/user/user.api'
import { userKeys } from '@/apis/user/user.key'
import { useQuery } from '@tanstack/react-query'

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
