import { ProfileUpdateData } from '@/core/types/request.type'

export type UpdateProfileResponse = {
    profile: ProfileUpdateData
}

export type UploadAvatarResponse = {
    profile: {
        avatar_url: string | null
    }
}

export type UploadCoverPhotoResponse = {
    profile: {
        cover_photo_url: string | null
        cover_photo_offset_y: number | null
    }
}
