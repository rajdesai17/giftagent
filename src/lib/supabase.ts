import { createClient } from '@supabase/supabase-js';

// Try both VITE_ prefixed vars (for frontend) and regular vars (for edge functions)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not defined. Please check your environment variables.");
}

if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY is not defined. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);