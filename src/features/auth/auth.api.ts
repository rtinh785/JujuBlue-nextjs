import { supabase } from '@/libs/supabase/client'

export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
        throw error
    }

    return data.user
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}
