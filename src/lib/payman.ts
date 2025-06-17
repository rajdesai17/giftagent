import { PaymanClient, Environment } from '@paymanai/payman-ts';
import { config } from './config';

const paymanClient = PaymanClient.withCredentials({
  clientId: config.paymanClientId,
  clientSecret: config.paymanClientSecret,
  environment: config.paymanEnvironment as Environment
});

export default paymanClient;

export const createPaymanClientWithToken = (accessToken: string, expiresIn: number) => {
  return PaymanClient.withToken(import.meta.env.VITE_PAYMAN_CLIENT_ID, {
    accessToken,
    expiresIn
  });
};