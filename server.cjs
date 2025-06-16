const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PaymanClient } = require('@paymanai/payman-ts');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/oauth/token', async (req, res) => {
  console.log('API /api/oauth/token hit');
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  const clientId = process.env.VITE_PAYMAN_CLIENT_ID;
  const clientSecret = process.env.VITE_PAYMAN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error('Missing Payman creds');
    return res.status(500).json({ error: 'Server misconfig' });
  }

  try {
    const client = PaymanClient.withAuthCode({ clientId, clientSecret }, code);
    const tokenResp = await client.getAccessToken();
    if (!tokenResp || !tokenResp.accessToken) throw new Error('Invalid token response');
    res.json({ accessToken: tokenResp.accessToken, expiresIn: tokenResp.expiresIn });
  } catch (err) {
    console.error('Token exchange failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running http://localhost:${PORT}`)); 