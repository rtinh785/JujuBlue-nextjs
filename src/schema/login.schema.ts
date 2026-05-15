import { AUTH_VALIDATION_MESSAGE } from '@/core/constants/auth.constant'
import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup.string().required(AUTH_VALIDATION_MESSAGE.EMAIL_REQUIRED).email(AUTH_VALIDATION_MESSAGE.EMAIL_INVALID),
    password: yup.string().required(AUTH_VALIDATION_MESSAGE.PASSWORD_REQUIRED),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
