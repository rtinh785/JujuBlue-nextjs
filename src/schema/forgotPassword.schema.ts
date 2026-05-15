import { AUTH_VALIDATION_MESSAGE } from '@/core/constants/auth.constant'
import * as yup from 'yup'

export const forgotPasswordSchema = yup.object({
    email: yup.string().required(AUTH_VALIDATION_MESSAGE.EMAIL_REQUIRED).email(AUTH_VALIDATION_MESSAGE.EMAIL_INVALID),
})

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>
