# GiftAgent v2 🎁

An AI-powered birthday gift automation platform that helps you never miss a birthday and send thoughtful gifts to your loved ones.

## Features

- 🤖 AI Chat Agent for instant gift sending
- 🎂 Automated birthday gift scheduling
- 💳 Secure payments via Payman SDK
- 👥 Contact management with gift preferences
- 📦 Gift delivery status tracking

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- Database: Supabase
- Payments: Payman SDK
- Deployment: Vercel

## Environment Variables

```env
# Backend Environment Variables
PAYMAN_CLIENT_ID=your-client-id
PAYMAN_CLIENT_SECRET=your-client-secret

# Frontend Environment Variables
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_PAYMAN_CLIENT_ID=your-client-id
VITE_PAYMAN_CLIENT_SECRET=your-client-secret
VITE_PAYMAN_ENVIRONMENT=test
VITE_STORE_PAYTAG=your-store-paytag
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
vercel dev
```

## Deployment

The project is automatically deployed to Vercel on push to the main branch.

## License

MIT