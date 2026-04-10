import { SuggestProfile } from '@/core/types/follow.type'
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

export type GetSuggestedProfilesResponse = {
    profiles: SuggestProfile[]
}

export type GetFollowCount = { following: number; followers: number }

export type GetFollowingList = {
    profiles: { id: string; username: string; display_name: string; avatar_url: string | null }[]
}
