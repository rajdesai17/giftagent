// Configuration that works in both edge runtime and browser environments
const getEnvVar = (key: string): string | undefined => {
  // For edge runtime (Vercel cron functions)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Get browser environment variable (Vite)
const getBrowserEnvVar = (key: string): string | undefined => {
  try {
    // In browser, access Vite environment variables
    const viteEnv = (import.meta as { env?: Record<string, string> }).env;
    return viteEnv?.[key];
  } catch {
    return undefined;
  }
};

// Get environment variable with fallback for browser
const getEnvWithFallback = (edgeKey: string, browserKey: string): string | undefined => {
  return getEnvVar(edgeKey) || getBrowserEnvVar(browserKey);
};

export const config = {
  // Configuration that works in both environments
  supabaseUrl: getEnvWithFallback('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvWithFallback('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
  storePaytag: getEnvWithFallback('STORE_PAYTAG', 'VITE_STORE_PAYTAG'),
  paymanClientId: getEnvWithFallback('PAYMAN_CLIENT_ID', 'VITE_PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnvWithFallback('PAYMAN_CLIENT_SECRET', 'VITE_PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnvWithFallback('PAYMAN_ENVIRONMENT', 'VITE_PAYMAN_ENVIRONMENT'),
  
  // Legacy support (keeping the same structure)
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnvVar('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnvVar('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnvVar('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnvVar('PAYMAN_ENVIRONMENT'),
} as const; 