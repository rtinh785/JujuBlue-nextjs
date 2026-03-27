import * as yup from 'yup'

export const forgotPasswordSchema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
})

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>
