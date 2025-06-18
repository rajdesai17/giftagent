// Simple configuration that works in both edge runtime and browser
const getEnvVar = (key: string): string | undefined => {
  // For edge runtime, environment variables should be available directly
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

export const config = {
  // Primary configuration for edge runtime
  supabaseUrl: getEnvVar('SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY'),
  storePaytag: getEnvVar('STORE_PAYTAG'),
  paymanClientId: getEnvVar('PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnvVar('PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnvVar('PAYMAN_ENVIRONMENT'),
  
  // Legacy support (keeping the same structure)
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnvVar('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnvVar('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnvVar('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnvVar('PAYMAN_ENVIRONMENT'),
} as const; 