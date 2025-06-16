import { PaymanClient } from '@paymanai/payman-ts';

export default async function handler(req, res) {
  console.log('OAuth token endpoint called');
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { code } = req.body;
  console.log('Received authorization code:', code ? `${code.substring(0, 20)}...` : 'undefined');
  
  if (!code) {
    console.error('No authorization code provided in request body');
    return res.status(400).json({ error: 'Authorization code is required' });
  }
  
  // On Vercel, server-side environment variables should not have the VITE_ prefix.
  const clientId = process.env.PAYMAN_CLIENT_ID;
  const clientSecret = process.env.PAYMAN_CLIENT_SECRET;
  
  console.log('Environment check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdPrefix: clientId?.substring(0, 7),
    nodeEnv: process.env.NODE_ENV
  });
  
  if (!clientId || !clientSecret) {
    console.error("Missing Payman client credentials in environment variables");
    console.error("Available env keys:", Object.keys(process.env).filter(k => k.includes('PAYMAN')));
    return res.status(500).json({ error: "Server configuration error: Missing Payman credentials" });
  }
  
  try {
    console.log('Creating PaymanClient with auth code...');
    
    const client = PaymanClient.withAuthCode(
      {
        clientId,
        clientSecret,
      },
      code
    );

    console.log('Calling getAccessToken...');
    const tokenResponse = await client.getAccessToken();
    console.log('Token response received:', { 
      hasAccessToken: !!tokenResponse?.accessToken, 
      hasExpiresIn: !!tokenResponse?.expiresIn,
      tokenType: typeof tokenResponse
    });

    if (!tokenResponse || !tokenResponse.accessToken) {
      console.error("Invalid token response from Payman:", tokenResponse);
      return res.status(500).json({ error: "Invalid token response from Payman" });
    }

    console.log('Token exchange successful, returning token to frontend');

    // Return in the format expected by the frontend as per documentation
    res.json({
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
    });
  } catch (error) {
    console.error("Token exchange failed with error:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return more specific error information
    let errorMessage = "Token exchange failed";
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 