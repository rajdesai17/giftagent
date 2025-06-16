import type { VercelRequest, VercelResponse } from '@vercel/node';
import payman from '../src/lib/payman-server';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { toWalletId, amount, description, metadata } = req.body;
    const fromWalletId = process.env.FROM_WALLET_ID;
    const prompt = `Send ${amount} TSD to wallet ${toWalletId}. Description: ${description}`;
    const response = await payman.ask(prompt, {
      metadata: {
        fromWalletId,
        ...metadata
      }
    });
    res.status(200).json({ success: true, payment: response });
  } catch (error) {
    console.error('API payment error:', error);
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
} 