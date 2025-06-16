import { PaymanClient } from '@paymanai/payman-ts';

// This function initializes the Payman client for server-side use.
// It ensures that the required environment variables are present.
function createPaymanClient() {
  const clientId = process.env.PAYMAN_CLIENT_ID as string;
  const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Payman credentials in environment variables');
  }
  
  // Machine-to-machine (client credentials) flow for backend/server use only
  return PaymanClient.withCredentials({
    clientId,
    clientSecret,
  });
}

const payman = createPaymanClient();

export default payman; 