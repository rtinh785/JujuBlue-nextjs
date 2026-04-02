import * as yup from 'yup'

export const editProfileSchema = yup.object({
    display_name: yup.string().trim().required('Tên hiển thị là bắt buộc').max(50, 'Tên hiển thị tối đa 50 ký tự'),

    bio: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(160, 'Tiểu sử tối đa 160 ký tự')
        .defined(),

    location: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(80, 'Địa điểm tối đa 80 ký tự')
        .defined(),

    website: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .test('is-valid-url', 'URL phải có dạng https://www.example.com', (value) => {
            if (!value) return true

            try {
                new URL(value)
                return true
            } catch {
                return false
            }
        })
        .defined(),

    date_of_birth: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .defined(),
})

export type EditProfileFormValues = yup.InferType<typeof editProfileSchema>
