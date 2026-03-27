import { createClient } from '@supabase/supabase-js'

import { envConfig } from '@/core/configs/env.config'

export const supabase = createClient(envConfig.SUPABASE_URL, envConfig.SUPABASE_ANON_KEY)
