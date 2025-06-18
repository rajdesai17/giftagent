// Declare the global variables defined by Vite (only available in browser build)
declare const __SUPABASE_URL__: string | undefined;
declare const __SUPABASE_ANON_KEY__: string | undefined;
declare const __STORE_PAYTAG__: string | undefined;
declare const __PAYMAN_CLIENT_ID__: string | undefined;
declare const __PAYMAN_CLIENT_SECRET__: string | undefined;
declare const __PAYMAN_ENVIRONMENT__: string | undefined;

// Configuration that works in both edge runtime and browser
const getEnvVar = (key: string, browserVar?: string | undefined): string | undefined => {
  // For edge runtime (Vercel functions) - use process.env
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value) return value;
  }
  
  // For browser environment - use defined variables (only if they exist)
  try {
    return browserVar;
  } catch {
    return undefined;
  }
};

// Safe getter for browser variables (handles cases where they're not defined)
const getBrowserVar = (varName: string): string | undefined => {
  try {
    switch (varName) {
      case 'SUPABASE_URL': return typeof __SUPABASE_URL__ !== 'undefined' ? __SUPABASE_URL__ : undefined;
      case 'SUPABASE_ANON_KEY': return typeof __SUPABASE_ANON_KEY__ !== 'undefined' ? __SUPABASE_ANON_KEY__ : undefined;
      case 'STORE_PAYTAG': return typeof __STORE_PAYTAG__ !== 'undefined' ? __STORE_PAYTAG__ : undefined;
      case 'PAYMAN_CLIENT_ID': return typeof __PAYMAN_CLIENT_ID__ !== 'undefined' ? __PAYMAN_CLIENT_ID__ : undefined;
      case 'PAYMAN_CLIENT_SECRET': return typeof __PAYMAN_CLIENT_SECRET__ !== 'undefined' ? __PAYMAN_CLIENT_SECRET__ : undefined;
      case 'PAYMAN_ENVIRONMENT': return typeof __PAYMAN_ENVIRONMENT__ !== 'undefined' ? __PAYMAN_ENVIRONMENT__ : undefined;
      default: return undefined;
    }
  } catch {
    return undefined;
  }
};

export const config = {
  // Configuration that works in both environments
  supabaseUrl: getEnvVar('SUPABASE_URL', getBrowserVar('SUPABASE_URL')),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY', getBrowserVar('SUPABASE_ANON_KEY')),
  storePaytag: getEnvVar('STORE_PAYTAG', getBrowserVar('STORE_PAYTAG')),
  paymanClientId: getEnvVar('PAYMAN_CLIENT_ID', getBrowserVar('PAYMAN_CLIENT_ID')),
  paymanClientSecret: getEnvVar('PAYMAN_CLIENT_SECRET', getBrowserVar('PAYMAN_CLIENT_SECRET')),
  paymanEnvironment: getEnvVar('PAYMAN_ENVIRONMENT', getBrowserVar('PAYMAN_ENVIRONMENT')),
  
  // Legacy support (keeping the same structure)
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnvVar('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnvVar('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnvVar('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnvVar('PAYMAN_ENVIRONMENT'),
} as const; 