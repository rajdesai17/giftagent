const clientId = process.env.PAYMAN_CLIENT_ID as string;
const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

if (!clientId || !clientSecret) {
  throw new Error('Missing Payman credentials in environment variables');
}

// Use dynamic import for better Vercel compatibility
const createPaymanClient = async () => {
  const { PaymanClient } = await import('@paymanai/payman-ts');
  return PaymanClient.withCredentials({
    clientId,
    clientSecret,
  });
};

// Export a promise that resolves to the client
export default createPaymanClient(); 