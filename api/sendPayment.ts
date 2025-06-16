import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Use dynamic import for better ES module compatibility
    const { PaymanClient } = await import('@paymanai/payman-ts');
    
    const clientId = process.env.PAYMAN_CLIENT_ID as string;
    const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;
    
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: 'Server configuration error: Missing Payman credentials' });
    }
    
    const payman = PaymanClient.withCredentials({
      clientId,
      clientSecret,
    });
    
    const prompt = `Send ${amount} ${token_symbol} from wallet on chain ${chain_id} to ${recipient_wallet_address}`;
    const result = await payman.ask(prompt, {
      metadata: {
        token_address: token_address,
      }
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}