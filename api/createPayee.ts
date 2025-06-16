import { PaymanClient } from '@paymanai/payman-ts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, address } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!name || !address || !token) {
    return res.status(400).json({ error: 'Missing name, address, or token' });
  }

  const clientId = process.env.VITE_PAYMAN_CLIENT_ID || process.env.PAYMAN_CLIENT_ID;
  const clientSecret = process.env.VITE_PAYMAN_CLIENT_SECRET || process.env.PAYMAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = PaymanClient.withAuthToken(
      {
        clientId,
        clientSecret,
      },
      token
    );

    const payee = await client.createPayee({
      name,
      // Assuming address is a simple string for the description
      description: `Address: ${address}`, 
    });

    res.status(200).json({ payeeId: payee.payeeId });
  } catch (error) {
    console.error('Failed to create payee:', error);
    res.status(500).json({ error: 'Failed to create payee' });
  }
} 