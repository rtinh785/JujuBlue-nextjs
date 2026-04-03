import { supabase } from './client'

// kiem tra coi profile da ton tai chua, neu chua thi tao moi
export const ensureProfileExists = async (user: {
    id: string
    email?: string
    user_metadata?: Record<string, any>
}) => {
    const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

    if (fetchError) {
        throw fetchError
    }

    if (existingProfile) {
        return existingProfile
    }

    const emailPrefix = user.email?.split('@')[0] ?? `user_${user.id.slice(0, 6)}`
    const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? emailPrefix

    const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null

    const username = `${emailPrefix}_${user.id.slice(0, 6)}`

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            username,
            display_name: displayName,
            avatar_url: avatarUrl,
        })
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}
