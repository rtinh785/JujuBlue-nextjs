import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from './auth.api'
import { authKeys } from './auth.keys'

export const useCurrentUser = () => {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: getCurrentUser,
        staleTime: 1000 * 60 * 5,
    })
}
