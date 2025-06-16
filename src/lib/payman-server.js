import { PaymanClient } from "@paymanai/payman-ts";

const payman = PaymanClient.withCredentials({
  clientId: process.env.PAYMAN_CLIENT_ID,
  clientSecret: process.env.PAYMAN_CLIENT_SECRET,
});

export default payman; 