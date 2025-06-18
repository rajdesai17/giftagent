import { PaymanClient } from "@paymanai/payman-ts";

export const config = {
  // Use the Node.js runtime so that Node-only dependencies work correctly.
  runtime: "nodejs18.x",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "Authorization code not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = PaymanClient.withAuthCode(
      {
        clientId: process.env.PAYMAN_CLIENT_ID!,
        clientSecret: process.env.PAYMAN_CLIENT_SECRET!,
      },
      code
    );

    const tokenResponse = await client.getAccessToken();

    return new Response(JSON.stringify({
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Token exchange failed:", error);
    return new Response(JSON.stringify({ error: "Token exchange failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 