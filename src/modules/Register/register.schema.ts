import * as yup from 'yup'

export const registerSchema = yup.object({
    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'ật khẩu tối thiểu 6 ký tự'),
    confirmPassword: yup
        .string()
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([yup.ref('password')], 'ật khẩu xác nhận không khớp'),
})

export type RegisterFormValues = yup.InferType<typeof registerSchema>
