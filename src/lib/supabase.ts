import { createClient } from '@supabase/supabase-js';

// Check if we're in an edge function environment
const isEdgeRuntime = typeof process !== 'undefined' && process.env.EDGE_RUNTIME === '1';

// Use appropriate environment variables based on runtime
const supabaseUrl = isEdgeRuntime 
  ? process.env.SUPABASE_URL 
  : import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey = isEdgeRuntime
  ? process.env.SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not defined. Please check your environment variables.");
}

if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY is not defined. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);