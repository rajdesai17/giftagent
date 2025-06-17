// Helper to get environment variables in a unified way
function getEnv(name: string): string {
  // Edge runtime
  if (typeof process !== 'undefined') {
    return process.env[name] ?? '';
  }
  // Vite/browser runtime
  return (import.meta.env[name] as string) ?? '';
}

export const config = {
  supabaseUrl: getEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
  storePaytag: getEnv('VITE_STORE_PAYTAG'),
  paymanClientId: getEnv('VITE_PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnv('VITE_PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnv('VITE_PAYMAN_ENVIRONMENT'),
  // Add non-VITE prefixed versions for the edge
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnv('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnv('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnv('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnv('PAYMAN_ENVIRONMENT'),
}; 