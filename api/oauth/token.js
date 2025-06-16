import { PaymanClient } from '@paymanai/payman-ts';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const clientId = process.env.PAYMAN_CLIENT_ID || process.env.VITE_PAYMAN_CLIENT_ID;
  const clientSecret = process.env.PAYMAN_CLIENT_SECRET || process.env.VITE_PAYMAN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server misconfig' });
  }

  try {
    const client = PaymanClient.withAuthCode({ clientId, clientSecret }, code);
    const tokenResp = await client.getAccessToken();
    if (!tokenResp || !tokenResp.accessToken) throw new Error('Invalid token response');
    res.json({ accessToken: tokenResp.accessToken, expiresIn: tokenResp.expiresIn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 