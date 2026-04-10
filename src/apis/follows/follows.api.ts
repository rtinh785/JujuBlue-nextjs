import http from '@/apis/axios'
import { CheckIsFollow, FollowRespone, UnFollowRespone } from '@/core/types/follow.type'
import { GetFollowCount, GetFollowingList, GetSuggestedProfilesResponse } from '@/core/types/respone.type'

export const followsApi = {
    getSuggestedProfiles() {
        return http.get<GetSuggestedProfilesResponse>('follows/suggestions')
    },
    followUser(followingUserId: string) {
        return http.post<FollowRespone>('follows', { followingUserId })
    },
    checkFollowing(followingUserId: string) {
        return http.get<CheckIsFollow>(`follows/check/${followingUserId}`)
    },
    unfollowUser(followingUserId: string) {
        return http.delete<UnFollowRespone>(`follows/${followingUserId}`)
    },
    getFollowCounts() {
        return http.get<GetFollowCount>('follows/counts')
    },
    getFollowing() {
        return http.get<GetFollowingList>('follows/following')
    },
}
