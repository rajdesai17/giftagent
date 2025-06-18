import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Check if we're in an edge function environment
const isEdgeRuntime = typeof process !== 'undefined' && process.env.EDGE_RUNTIME === '1';

const supabaseUrl = config.supabaseUrl || config.SUPABASE_URL;
const supabaseAnonKey = config.supabaseAnonKey || config.SUPABASE_ANON_KEY;

// Debug logging for edge runtime
if (isEdgeRuntime) {
  console.log('Edge runtime detected');
  console.log('Config keys available:', Object.keys(config));
  console.log('Supabase URL found:', !!supabaseUrl);
  console.log('Supabase Key found:', !!supabaseAnonKey);
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `Supabase configuration missing: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`;
  console.error(errorMsg);
  console.error('Available env vars:', Object.keys(process?.env || {}));
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);