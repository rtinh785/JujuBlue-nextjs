import { useMutation } from '@tanstack/react-query'
import authApi from './auth.api'
import { authKeys } from './auth.keys'

export const useLoginMutation = () => {
    return useMutation({
        mutationKey: authKeys.login(),
        mutationFn: authApi.loginAccount,
    })
}

export const useRegisterMutation = () => {
    return useMutation({
        mutationKey: authKeys.register(),
        mutationFn: authApi.registerAccount,
    })
}
