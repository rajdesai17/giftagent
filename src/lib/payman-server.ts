import * as Payman from '@paymanai/payman-ts';

const clientId = process.env.PAYMAN_CLIENT_ID as string;
const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

if (!clientId || !clientSecret) {
  throw new Error('Missing Payman credentials in environment variables');
}

const payman = Payman.PaymanClient.withCredentials({
  clientId,
  clientSecret,
});

export default payman; 