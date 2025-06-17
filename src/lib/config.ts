// Helper: safely fetch environment variable by trying several keys
function getEnv(...keys: string[]): string | undefined {
  // Prefer process.env (Edge / Node)
  if (typeof process !== 'undefined' && process.env) {
    for (const k of keys) {
      const val = process.env[k];
      if (val) return val;
    }
  }

  // Fallback to Vite import.meta.env (browser build)
  let viteEnv: Record<string, string | undefined> | undefined;
  try {
    // @ts-ignore - import.meta is available when bundled by Vite
    viteEnv = (import.meta as any).env;
  } catch {
    // ignore
  }

  if (viteEnv) {
    for (const k of keys) {
      const val = viteEnv[k];
      if (val) return val;
    }
  }

  return undefined;
}

export const config = {
  supabaseUrl: getEnv('SUPABASE_URL', 'VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnv('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
  storePaytag: getEnv('STORE_PAYTAG', 'VITE_STORE_PAYTAG'),
  paymanClientId: getEnv('PAYMAN_CLIENT_ID', 'VITE_PAYMAN_CLIENT_ID'),
  paymanClientSecret: getEnv('PAYMAN_CLIENT_SECRET', 'VITE_PAYMAN_CLIENT_SECRET'),
  paymanEnvironment: getEnv('PAYMAN_ENVIRONMENT', 'VITE_PAYMAN_ENVIRONMENT'),
  // Add non-VITE prefixed versions for the edge
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
  STORE_PAYTAG: getEnv('STORE_PAYTAG'),
  PAYMAN_CLIENT_ID: getEnv('PAYMAN_CLIENT_ID'),
  PAYMAN_CLIENT_SECRET: getEnv('PAYMAN_CLIENT_SECRET'),
  PAYMAN_ENVIRONMENT: getEnv('PAYMAN_ENVIRONMENT'),
} as const; 