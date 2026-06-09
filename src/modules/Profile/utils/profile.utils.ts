import type { EditProfileFormValues } from '@/schema/editProfile.schema'
import type { ProfileUpdateData } from '@/core/types/request.type'

export const cleanProfileUpdatePayload = (values: EditProfileFormValues): ProfileUpdateData => {
    const cleaned: ProfileUpdateData = {
        ...values,
        date_of_birth: values.date_of_birth || null,
    }

    Object.keys(cleaned).forEach((key) => {
        const profileKey = key as keyof ProfileUpdateData

        if (cleaned[profileKey] === '' || cleaned[profileKey] === undefined) {
            delete cleaned[profileKey]
        }
    })

    return cleaned
}
