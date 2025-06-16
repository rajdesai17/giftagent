import { PaymanClient } from "@paymanai/payman-ts";

// This function initializes the Payman client for server-side use.
// It ensures that the required environment variables are present.
function createPaymanClient() {
  const clientId = process.env.PAYMAN_CLIENT_ID;
  const clientSecret = process.env.PAYMAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Payman client credentials in environment variables. Please set PAYMAN_CLIENT_ID and PAYMAN_CLIENT_SECRET.');
  }
  
  // Machine-to-machine (client credentials) flow for backend/server use only
  return PaymanClient.withCredentials({
    clientId,
    clientSecret,
  });
}

const payman = createPaymanClient();

export default payman; 