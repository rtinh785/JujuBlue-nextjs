import { supabase } from '@/libs/supabase/client'

export const getMyProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
        throw error
    }

    return data
}
