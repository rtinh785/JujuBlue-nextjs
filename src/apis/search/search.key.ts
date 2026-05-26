import { SearchParams } from '@/core/types/search.type'

export const searchKeys = {
    all: () => ['search'] as const,
    results: (params: SearchParams) => ['search', 'results', params] as const,
}
