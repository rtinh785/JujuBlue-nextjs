import { useQuery } from '@tanstack/react-query'
import searchApi from './search.api'
import { searchKeys } from './search.key'
import { SearchParams } from '@/core/types/search.type'

export const useSearch = (params: SearchParams, enabled = true) => {
    return useQuery({
        queryKey: searchKeys.results(params),
        queryFn: async () => {
            const res = await searchApi.search(params)
            return res.data
        },
        enabled: enabled && !!params.q?.trim(),
    })
}
