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
  const viteClientId = config.paymanClientId || config.PAYMAN_CLIENT_ID;
  if (!viteClientId) {
    throw new Error('Payman client ID is missing for token-based client creation.');
  }
  return PaymanClient.withToken(viteClientId, {
    accessToken,
    expiresIn
  });
};