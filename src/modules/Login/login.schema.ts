import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    password: yup.string().required('Mật khẩu là bắt buộc'),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>
