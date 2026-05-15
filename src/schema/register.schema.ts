import { AUTH_VALIDATION_MESSAGE } from '@/core/constants/auth.constant'
import * as yup from 'yup'

export const registerSchema = yup.object({
    email: yup.string().required(AUTH_VALIDATION_MESSAGE.EMAIL_REQUIRED).email(AUTH_VALIDATION_MESSAGE.EMAIL_INVALID),
    password: yup
        .string()
        .required(AUTH_VALIDATION_MESSAGE.PASSWORD_REQUIRED)
        .min(6, AUTH_VALIDATION_MESSAGE.PASSWORD_MIN),
    confirmPassword: yup
        .string()
        .required(AUTH_VALIDATION_MESSAGE.CONFIRM_PASSWORD_REQUIRED)
        .oneOf([yup.ref('password')], AUTH_VALIDATION_MESSAGE.PASSWORDS_MUST_MATCH),
})

export type RegisterFormValues = yup.InferType<typeof registerSchema>
