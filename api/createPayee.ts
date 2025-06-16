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

  const clientId = process.env.PAYMAN_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Server configuration error: Missing Client ID' });
  }

  try {
    // The SDK's withToken method requires an `expiresIn` field.
    // Since we only have the token from the authorization header, we'll supply a
    // default value. This is a short-lived operation, so the exact expiry is not critical.
    const tokenObject = {
      accessToken: token,
      expiresIn: 3600, // Default to 1 hour
    };
    const client = PaymanClient.withToken(clientId, tokenObject);

    const creationPrompt = `Create a new payee named "${name}" with the address "${address}"`;
    
    console.log(`Sending prompt to Payman: "${creationPrompt}"`);

    const response = await client.ask(creationPrompt);

    // The response type `FormattedTaskResponse` doesn't have a payeeId,
    // but the actual response from the API might. We access it dynamically
    // to avoid TypeScript errors and log the whole object for debugging.
    console.log('Received response from Payman .ask()', response);
    const payeeId = response['payeeId'];

    if (!payeeId) {
      console.error('Could not find payeeId in Payman response', response);
      return res.status(500).json({ error: 'Failed to extract payeeId from Payman response' });
    }

    res.status(200).json({ payeeId: payeeId });
  } catch (error) {
    console.error('Failed to create payee via .ask():', error);
    res.status(500).json({ error: 'Failed to create payee' });
  }
} 