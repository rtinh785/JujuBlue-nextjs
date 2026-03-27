import * as yup from 'yup'

export const requestResetPassword = yup.object({
    newPassword: yup.string().required('New password is required').min(8, 'Password must be at least 8 characters'),
})

export type RequestResetPasswordFormValues = yup.InferType<typeof requestResetPassword>
