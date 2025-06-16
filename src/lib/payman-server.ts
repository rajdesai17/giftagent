// Create a singleton Payman client instance for server-side use
let paymanInstance: unknown = null;

async function getPaymanClient() {
  if (!paymanInstance) {
    const clientId = process.env.PAYMAN_CLIENT_ID as string;
    const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Payman credentials in environment variables');
    }

    // Use dynamic import for ES module compatibility
    const { PaymanClient } = await import('@paymanai/payman-ts');
    
    paymanInstance = PaymanClient.withCredentials({
      clientId,
      clientSecret,
    });
  }
  
  return paymanInstance;
}

export default { getPaymanClient }; 