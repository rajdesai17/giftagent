import type { VercelRequest, VercelResponse } from '@vercel/node';
import paymanServer from '../src/lib/payman-server';

interface PaymanClient {
  ask(prompt: string, options?: { metadata?: Record<string, unknown> }): Promise<unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    recipient_wallet_address,
    amount,
    token_address,
    token_symbol,
    chain_id,
  } = req.body;

  try {
    const payman = await paymanServer.getPaymanClient() as PaymanClient;
    const prompt = `Send ${amount} ${token_symbol} from wallet on chain ${chain_id} to ${recipient_wallet_address}`;
    const result = await payman.ask(prompt, {
      metadata: {
        token_address: token_address,
      }
    });
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}