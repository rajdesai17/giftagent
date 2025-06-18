# GiftAgent 🎁

An AI-powered birthday gift automation platform that helps you never miss a birthday and send thoughtful gifts to your loved ones.

## How It Works

1.  **Connect Payman**: Securely link your Payman account in seconds using an OAuth-based popup.
2.  **Add Contacts**: Store birthdays and gift preferences for your friends and family.
3.  **Send & Schedule Gifts**: Use the AI agent to instantly send a gift or schedule one for an upcoming birthday.
4.  **Automated Delivery**: On the scheduled date, the gift is automatically purchased from our mock store and sent to the contact's address.

## Key Features

- 🤖 **AI Chat Agent**: For instant gift suggestions and sending.
- 🎂 **Automated Birthday Gifting**: Schedule gifts in advance. On the recipient's birthday, the gift is automatically purchased and sent from a mock store.
- 💳 **Secure Payments via Payman**: Authorize gift payments without sharing sensitive financial data.
- 👥 **Contact Management**: Keep track of important dates and preferences.
- 📦 **Gift Delivery Status**: Monitor the status of your sent gifts.

## Payments with Payman

This project uses the [Payman SDK](https://www.payman.ai/) for secure, token-based payment processing.

-   **OAuth Connection**: When you connect your account, you are redirected to Payman to authorize the application. You grant specific permissions (like sending payments) without sharing your login credentials.
-   **Transaction Flow**: The application uses the generated token to process payments for scheduled or instant gifts on your behalf. This ensures your financial details remain secure within Payman.

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
# VITE_PAYMAN_CLIENT_SECRET is not needed in the frontend
VITE_PAYMAN_ENVIRONMENT=test
VITE_STORE_PAYTAG=your-store-paytag
```

## Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## License

MIT