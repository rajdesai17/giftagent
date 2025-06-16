import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('OAuth token endpoint called. Method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, redirectUri } = req.body;
    console.log('Received authorization code:', code ? `${code.substring(0, 20)}...` : 'undefined');

    if (!code || !redirectUri) {
      console.error('No authorization code or redirectUri provided in request body');
      return res.status(400).json({ error: 'Authorization code and redirectUri are required' });
    }

    const clientId = process.env.PAYMAN_CLIENT_ID as string;
    const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;

    if (!clientId || !clientSecret) {
      console.error("Critical: Missing Payman client credentials in environment variables.");
      return res.status(500).json({ error: "Server configuration error: Missing Payman credentials." });
    }

    console.log('Exchanging authorization code for token via direct API call...');

    const tokenEndpoint = 'https://app.paymanai.com/oauth/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const tokenResponse = await response.json();

    if (!response.ok) {
      console.error('Payman API Error:', tokenResponse);
      return res.status(response.status).json({ 
        error: 'Failed to exchange code for token',
        details: tokenResponse
      });
    }

    console.log('Token exchange successful, returning token to frontend.');
    res.status(200).json(tokenResponse);

  } catch (error: unknown) {
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) };
    
    console.error("Token exchange failed with an unexpected error:", errorObj);
    
    res.status(500).json({ 
      error: "An unexpected error occurred during token exchange",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}