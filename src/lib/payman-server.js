import { PaymanClient } from "@paymanai/payman-ts";

// Machine-to-machine (client credentials) flow for backend/server use only
const payman = PaymanClient.withCredentials({
  clientId: process.env.PAYMAN_CLIENT_ID,
  clientSecret: process.env.PAYMAN_CLIENT_SECRET,
});

export default payman; 