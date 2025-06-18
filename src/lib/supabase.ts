import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Check if we're in an edge function environment
const isEdgeRuntime = typeof process !== 'undefined' && process.env.EDGE_RUNTIME === '1';
const isBrowser = typeof window !== 'undefined';

const supabaseUrl = config.supabaseUrl || config.SUPABASE_URL;
const supabaseAnonKey = config.supabaseAnonKey || config.SUPABASE_ANON_KEY;

// Enhanced debugging for different environments
if (isEdgeRuntime) {
  console.log('=== EDGE RUNTIME DEBUG ===');
  console.log('- Final supabaseUrl:', !!supabaseUrl);
  console.log('- Final supabaseAnonKey:', !!supabaseAnonKey);
  
  if (supabaseUrl) {
    console.log('- Supabase URL starts with:', supabaseUrl.substring(0, 20) + '...');
  }
  console.log('=== END DEBUG ===');
} else if (isBrowser) {
  console.log('=== BROWSER DEBUG ===');
  console.log('- Final supabaseUrl:', !!supabaseUrl);
  console.log('- Final supabaseAnonKey:', !!supabaseAnonKey);
  
  if (supabaseUrl) {
    console.log('- Supabase URL starts with:', supabaseUrl.substring(0, 20) + '...');
  }
  console.log('=== END BROWSER DEBUG ===');
}

if (!supabaseUrl || !supabaseAnonKey) {
  const environment = isEdgeRuntime ? 'edge runtime' : isBrowser ? 'browser' : 'unknown';
  const errorMsg = `Supabase configuration missing in ${environment}: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`;
  console.error(errorMsg);
  
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);