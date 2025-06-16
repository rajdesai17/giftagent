import type { VercelRequest, VercelResponse } from '@vercel/node';
import sendGiftsForToday from '../src/lib/sendGifts.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await sendGiftsForToday();
    console.log('Gifts sent successfully.');
    res.status(200).json({ success: true, message: 'Gifts sent successfully.' });
  } catch (error) {
    console.error('Failed to send gifts:', error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
} 