// Helper to get environment variables in a unified way
function getEnvVar(name: string): string {
  // For edge functions
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name] || process.env[`VITE_${name}`];
    if (value) return value;
  }

  // For browser/Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[`VITE_${name}`];
    if (value) return value;
  }

  throw new Error(`Environment variable ${name} is not defined`);
}

export const config = {
  supabaseUrl: getEnvVar('SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY'),
  storePaytag: getEnvVar('STORE_PAYTAG'),
  paymanClientId: getEnvVar('PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnvVar('PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnvVar('PAYMAN_ENVIRONMENT')
} as const; 