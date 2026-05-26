import http from '@/apis/axios'
import { SearchParams, SearchResponse } from '@/core/types/search.type'

const searchApi = {
    search(params: SearchParams) {
        const searchParams = new URLSearchParams()

        if (params.q) {
            searchParams.set('q', params.q)
        }

        if (params.type) {
            searchParams.set('type', params.type)
        }

        if (params.sort) {
            searchParams.set('sort', params.sort)
        }

        const queryString = searchParams.toString()

        return http.get<SearchResponse>(`search${queryString ? `?${queryString}` : ''}`)
    },
}

export default searchApi
