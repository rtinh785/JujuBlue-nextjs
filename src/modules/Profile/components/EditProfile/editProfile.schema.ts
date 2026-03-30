import * as yup from 'yup'

export const editProfileSchema = yup.object({
    display_name: yup.string().trim().required('Ten hien thi la bat buoc').max(50, 'Ten hien thi toi da 50 ky tu'),
    bio: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(160, 'Bio toi da 160 ky tu')
        .defined(),
    location: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(80, 'Dia diem toi da 80 ky tu')
        .defined(),
    website: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .test('is-valid-url', 'Website khong hop le', (value) => {
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
