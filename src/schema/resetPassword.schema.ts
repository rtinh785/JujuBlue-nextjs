import { AUTH_VALIDATION_MESSAGE } from '@/core/constants/auth.constant'
import * as yup from 'yup'

export const requestResetPassword = yup.object({
    newPassword: yup
        .string()
        .required(AUTH_VALIDATION_MESSAGE.NEW_PASSWORD_REQUIRED)
        .min(8, AUTH_VALIDATION_MESSAGE.NEW_PASSWORD_MIN),
})

export type RequestResetPasswordFormValues = yup.InferType<typeof requestResetPassword>
