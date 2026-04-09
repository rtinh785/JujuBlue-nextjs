import http from '@/apis/axios'
import { GetSuggestedProfilesResponse } from '@/core/types/respone.type'

export const followsApi = {
    getSuggestedProfiles() {
        return http.get<GetSuggestedProfilesResponse>('follows/suggestions')
    },
}
