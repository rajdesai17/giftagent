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
  console.log('Environment variables check:');
  console.log('- SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
  console.log('- SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);
  console.log('- Config supabaseUrl:', !!config.supabaseUrl);
  console.log('- Config supabaseAnonKey:', !!config.supabaseAnonKey);
  console.log('- Final supabaseUrl:', !!supabaseUrl);
  console.log('- Final supabaseAnonKey:', !!supabaseAnonKey);
  
  // Log first few characters of the URL for verification
  if (supabaseUrl) {
    console.log('- Supabase URL starts with:', supabaseUrl.substring(0, 20) + '...');
  }
  
  console.log('=== END DEBUG ===');
} else if (isBrowser) {
  console.log('=== BROWSER DEBUG ===');
  console.log('- Config supabaseUrl:', !!config.supabaseUrl);
  console.log('- Config supabaseAnonKey:', !!config.supabaseAnonKey);
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
  
  // Additional debugging for missing vars
  if (isEdgeRuntime && process.env) {
    console.error('Available environment variables:', Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || key.includes('PAYMAN') || key.includes('STORE')
    ));
  }
  
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);