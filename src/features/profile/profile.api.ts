import { supabase } from '@/libs/supabase/client'

const PROFILE_IMAGES_BUCKET = 'images'

export type UpdateProfilePayload = {
    display_name?: string
    bio?: string | null
    location?: string | null
    website?: string | null
    date_of_birth?: string | null
    avatar_url?: string | null
    cover_photo_url?: string | null
    cover_photo_offset_y?: number | null
}

export const getMyProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
        throw error
    }

    return data
}

export const updateMyProfile = async (userId: string, payload: UpdateProfilePayload) => {
    const { data, error } = await supabase.from('profiles').update(payload).eq('id', userId).select().single()

    if (error) throw error
    return data
}

export const uploadAvatar = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from(PROFILE_IMAGES_BUCKET).upload(filePath, file, {
        upsert: false,
    })

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(filePath)

    return data.publicUrl
}

export const uploadCoverPhoto = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const filePath = `cover-photos/${userId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, {
        upsert: false,
    })

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath)

    return data.publicUrl
}

export const getSuggestedProfiles = async (currentUserId: string) => {
    const { data, error } = await supabase.from('follows').select('following_id').eq('follower_id', currentUserId)

    const excludeIds = (data ?? []).map((row) => row.following_id)
    excludeIds.push(currentUserId)

    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(6)

    if (profilesError) throw profilesError
    return profiles ?? []
}
