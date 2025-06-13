import type { VercelRequest, VercelResponse } from '@vercel/node';
import payman from '../lib/payman';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { toWalletId, amount, description, metadata } = req.body;
    const fromWalletId = process.env.VITE_FROM_WALLET_ID;
    const payment = await payman.payments.create({
      fromWalletId,
      toWalletId,
      amount,
      currency: 'TSD',
      description,
      metadata,
    });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error('API payment error:', error);
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
} 