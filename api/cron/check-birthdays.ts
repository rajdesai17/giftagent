import { checkAndSendBirthdayGifts } from '../../src/lib/automatedGifting';

export const config = {
  // Use the Node.js serverless runtime (default is Node 20).
  // This allows importing packages that rely on Node APIs which are not available in the Edge runtime.
  runtime: 'nodejs18.x',
  regions: ['bom1'],
};

export default async function handler(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Run the birthday gift check
    const result = await checkAndSendBirthdayGifts();

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Birthday check cron error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 