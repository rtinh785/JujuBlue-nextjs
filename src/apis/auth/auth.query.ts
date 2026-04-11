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

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationKey: authKeys.forgotPassword(),
        mutationFn: authApi.forgotPassword,
    })
}

export const useResetPasswordMutation = () => {
    return useMutation({
        mutationKey: authKeys.resetPassword(),
        mutationFn: ({ body, accessToken }: { body: { new_password: string }; accessToken: string }) =>
            authApi.resetPassword(body, accessToken),
    })
}
