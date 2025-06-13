// @ts-ignore
import { PaymanClient } from "@paymanai/payman-ts";

const payman = PaymanClient.withCredentials({
  clientId: import.meta.env.VITE_PAYMAN_CLIENT_ID,
  clientSecret: import.meta.env.VITE_PAYMAN_CLIENT_SECRET,
});

export default payman; 