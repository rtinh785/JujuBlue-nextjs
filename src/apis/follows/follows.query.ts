import { followsApi } from '@/apis/follows/follows.api'
import { followsKeys } from '@/apis/follows/follows.key'
import { useQuery } from '@tanstack/react-query'

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
