// Declare the global variables defined by Vite
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;
declare const __STORE_PAYTAG__: string;
declare const __PAYMAN_CLIENT_ID__: string;
declare const __PAYMAN_CLIENT_SECRET__: string;
declare const __PAYMAN_ENVIRONMENT__: string;

// Configuration that works in both edge runtime and browser
const getEnvVar = (key: string, browserValue?: string): string | undefined => {
  // For edge runtime (Vercel functions) - use process.env
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value) return value;
  }
  
  // For browser environment - use defined variables
  return browserValue;
};

export const config = {
  // Configuration that works in both environments
  supabaseUrl: getEnvVar('SUPABASE_URL', __SUPABASE_URL__),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY', __SUPABASE_ANON_KEY__),
  storePaytag: getEnvVar('STORE_PAYTAG', __STORE_PAYTAG__),
  paymanClientId: getEnvVar('PAYMAN_CLIENT_ID', __PAYMAN_CLIENT_ID__),
  paymanClientSecret: getEnvVar('PAYMAN_CLIENT_SECRET', __PAYMAN_CLIENT_SECRET__),
  paymanEnvironment: getEnvVar('PAYMAN_ENVIRONMENT', __PAYMAN_ENVIRONMENT__),
  
  // Legacy support (keeping the same structure)
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnvVar('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnvVar('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnvVar('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnvVar('PAYMAN_ENVIRONMENT'),
} as const; 