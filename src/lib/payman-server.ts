// Create a singleton Payman client instance for server-side use
let paymanInstance: unknown = null;

async function getPaymanClient() {
  if (!paymanInstance) {
    const clientId = process.env.PAYMAN_CLIENT_ID as string;
    const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Payman credentials in environment variables');
    }

    // Use CommonJS wrapper to avoid ES module issues
    const { createPaymanClient } = eval('require')('../../api/payman-wrapper.js');
    const PaymanClient = createPaymanClient();
    
    paymanInstance = PaymanClient.withCredentials({
      clientId,
      clientSecret,
    });
  }
  
  return paymanInstance;
}

export default { getPaymanClient }; 