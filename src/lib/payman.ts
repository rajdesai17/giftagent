import { PaymanClient } from '@paymanai/payman-ts';
import { config } from './config';

const clientId = config.paymanClientId || config.PAYMAN_CLIENT_ID;
const clientSecret = config.paymanClientSecret || config.PAYMAN_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error('Payman credentials are missing in environment variables.');
}

const paymanClient = PaymanClient.withCredentials({
  clientId,
  clientSecret,
});

export default paymanClient;

export const createPaymanClientWithToken = (accessToken: string, expiresIn: number) => {
  return PaymanClient.withToken(import.meta.env.VITE_PAYMAN_CLIENT_ID, {
    accessToken,
    expiresIn
  });
};