import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Null when the env vars are missing, so the rest of the app keeps working. */
export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseConfigured = supabase !== null