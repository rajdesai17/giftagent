import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Check if we're in an edge function environment
const isEdgeRuntime = typeof process !== 'undefined' && process.env.EDGE_RUNTIME === '1';

const supabaseUrl = config.supabaseUrl || config.SUPABASE_URL;
const supabaseAnonKey = config.supabaseAnonKey || config.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);