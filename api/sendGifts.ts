import type { VercelRequest, VercelResponse } from '@vercel/node';
import sendGiftsForToday from '../src/lib/sendGifts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await sendGiftsForToday();
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
} 