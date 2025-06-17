import { PaymanClient } from '@paymanai/payman-ts';

const paymanClient = PaymanClient.withCredentials({
  clientId: import.meta.env.VITE_PAYMAN_CLIENT_ID,
  clientSecret: import.meta.env.VITE_PAYMAN_CLIENT_SECRET,
});

export default paymanClient;

export const createPaymanClientWithToken = (accessToken: string, expiresIn: number) => {
  return PaymanClient.withToken(import.meta.env.VITE_PAYMAN_CLIENT_ID, {
    accessToken,
    expiresIn
  });
};