import { PaymanClient } from '@paymanai/payman-ts';
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
    
    // On Vercel, server-side environment variables should not have the VITE_ prefix.
    const clientId = process.env.PAYMAN_CLIENT_ID as string;
    const clientSecret = process.env.PAYMAN_CLIENT_SECRET as string;
    
    // Detailed logging for debugging Vercel environment variables
    console.log('Environment variable check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdPrefix: clientId?.substring(0, 7),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
    
    if (!clientId || !clientSecret) {
      console.error("Critical: Missing Payman client credentials in environment variables.");
      return res.status(500).json({ error: "Server configuration error: Missing Payman credentials." });
    }
    
    console.log('Initializing PaymanClient with auth code...');
    
    const client = new PaymanClient({
      clientId,
      clientSecret,
      authorizationCode: code,
      redirectUri,
      environment: 'test'
    });

    console.log('Calling getAccessToken...');
    const tokenResponse = await client.getAccessToken();
    console.log('Token response received:', { 
      hasAccessToken: !!tokenResponse?.access_token, 
      tokenType: tokenResponse?.token_type,
      expiresIn: tokenResponse?.expires_in,
    });

    if (!tokenResponse || !tokenResponse.access_token) {
      console.error("Invalid token response from Payman:", tokenResponse);
      return res.status(500).json({ error: "Invalid token response from Payman" });
    }

    console.log('Token exchange successful, returning token to frontend.');

    res.json({
      success: true,
      access_token: tokenResponse.access_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in,
    });
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) };
    
    console.error("Token exchange failed with error:", errorObj);
    
    res.status(500).json({ 
      error: "Token exchange failed",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}