import * as Payman from '@paymanai/payman-ts';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Define an interface for the expected structure of the response from the .ask() call.
// We only care about the payeeId for now.
interface PayeeResponse {
  payeeId: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, address } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!name || !address || !token) {
    return res.status(400).json({ error: 'Missing name, address, or token' });
  }

  const clientId = process.env.PAYMAN_CLIENT_ID as string;
  if (!clientId) {
    return res.status(500).json({ error: 'Server configuration error: Missing Client ID' });
  }

  try {
    const tokenObject = {
      accessToken: token,
      expiresIn: 3600,
    };
    const client = Payman.PaymanClient.withToken(clientId, tokenObject);

    const creationPrompt = `Create a new payee named "${name}" with the address "${address}"`;
    
    console.log(`Sending prompt to Payman: "${creationPrompt}"`);

    const response = await client.ask(creationPrompt);

    console.log('Received response from Payman .ask()', response);
    // Cast to unknown first, then to our expected type, as suggested by the compiler.
    const payeeId = (response as unknown as PayeeResponse).payeeId;

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