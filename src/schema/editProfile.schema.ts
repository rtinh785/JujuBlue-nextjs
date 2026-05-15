import { PROFILE_VALIDATION_MESSAGE } from '@/core/constants/profile.constant'
import * as yup from 'yup'

export const editProfileSchema = yup.object({
    display_name: yup
        .string()
        .trim()
        .required(PROFILE_VALIDATION_MESSAGE.DISPLAY_NAME_REQUIRED)
        .max(50, PROFILE_VALIDATION_MESSAGE.DISPLAY_NAME_MAX),

    bio: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(160, PROFILE_VALIDATION_MESSAGE.BIO_MAX)
        .defined(),

    location: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .max(80, PROFILE_VALIDATION_MESSAGE.LOCATION_MAX)
        .defined(),

    website: yup
        .string()
        .nullable()
        .transform((value) => value ?? '')
        .test('is-valid-url', PROFILE_VALIDATION_MESSAGE.WEBSITE_INVALID, (value) => {
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
