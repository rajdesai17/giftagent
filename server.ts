import express from 'express';
import cors from 'cors';
import { PaymanClient } from '@paymanai/payman-ts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/oauth/token', async (req, res) => {
  console.log('Server: /api/oauth/token endpoint hit');
  
  const { code } = req.body;
  if (!code) {
    console.error('Server: No authorization code provided.');
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  const clientId = process.env.VITE_PAYMAN_CLIENT_ID;
  const clientSecret = process.env.VITE_PAYMAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Server: Missing Payman credentials in .env file');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = PaymanClient.withAuthCode({ clientId, clientSecret }, code);
    const tokenResponse = await client.getAccessToken();

    if (!tokenResponse || !tokenResponse.accessToken) {
      console.error('Server: Invalid token response from Payman');
      return res.status(500).json({ error: 'Invalid token response from Payman' });
    }

    console.log('Server: Token exchange successful');
    res.json({
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
    });

  } catch (error) {
    console.error('Server: Token exchange failed', error);
    res.status(500).json({ error: 'Token exchange failed', details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
}); 