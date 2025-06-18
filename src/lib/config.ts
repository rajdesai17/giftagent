// Configuration that works in both edge runtime and browser
const getEnvVar = (serverKey: string, browserKey: string): string | undefined => {
  // For edge runtime (Vercel functions) - use process.env
  if (typeof process !== 'undefined' && process.env && process.env[serverKey]) {
    return process.env[serverKey];
  }
  
  // For browser environment - use import.meta.env with VITE_ prefix
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[browserKey];
  }
  
  return undefined;
};

export const config = {
  // Main configuration
  supabaseUrl: getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
  storePaytag: getEnvVar('STORE_PAYTAG', 'VITE_STORE_PAYTAG'),
  paymanClientId: getEnvVar('PAYMAN_CLIENT_ID', 'VITE_PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnvVar('PAYMAN_CLIENT_SECRET', 'VITE_PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnvVar('PAYMAN_ENVIRONMENT', 'VITE_PAYMAN_ENVIRONMENT'),
  
  // Legacy support (keeping the same structure)
  SUPABASE_URL: getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnvVar('STORE_PAYTAG', 'VITE_STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnvVar('PAYMAN_CLIENT_ID', 'VITE_PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnvVar('PAYMAN_CLIENT_SECRET', 'VITE_PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnvVar('PAYMAN_ENVIRONMENT', 'VITE_PAYMAN_ENVIRONMENT'),
} as const; 