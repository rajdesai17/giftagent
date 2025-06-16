const clientId = process.env.PAYMAN_CLIENT_ID as string;
const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

if (!clientId || !clientSecret) {
  throw new Error('Missing Payman credentials in environment variables');
}

// Dynamic import with CommonJS fallback for Vercel compatibility
const createPaymanClient = async () => {
  const loadPaymanClient = async () => {
    try {
      const module = await import('@paymanai/payman-ts');
      return module.PaymanClient || module.default?.PaymanClient || module;
    } catch (importError) {
      console.error('Dynamic import failed, trying eval require:', importError);
      const requireFunc = eval('require');
      const module = requireFunc('@paymanai/payman-ts');
      return module.PaymanClient || module.default?.PaymanClient || module;
    }
  };
  
  const PaymanClient = await loadPaymanClient();
  return PaymanClient.withCredentials({
    clientId,
    clientSecret,
  });
};

// Export a promise that resolves to the client
export default createPaymanClient(); 