import { supabase } from './client'

export const signInWithGoogle = async (redirectTo: string) => {
    return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        },
    })
}
