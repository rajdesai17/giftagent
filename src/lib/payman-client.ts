import * as Payman from '@paymanai/payman-ts';

interface PaymanTokenData {
  accessToken: string;
  expiresIn: number;
}

/**
 * Get an authenticated PaymanClient instance using stored OAuth token
 * Returns null if no valid token is available
 */
export function getAuthenticatedPaymanClient(): Payman.PaymanClient | null {
  try {
    const tokenDataString = localStorage.getItem('payman_token');
    if (!tokenDataString) {
      return null;
    }

    const tokenData: PaymanTokenData = JSON.parse(tokenDataString);
    if (!tokenData.accessToken || !tokenData.expiresIn) {
      return null;
    }

    const clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;
    if (!clientId) {
      console.error('Missing VITE_PAYMAN_CLIENT_ID environment variable');
      return null;
    }

    // Create authenticated client as per documentation
    return Payman.PaymanClient.withToken(clientId, {
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
    });
  } catch (error) {
    console.error('Failed to create authenticated Payman client:', error);
    return null;
  }
}

/**
 * Check if user has connected their Payman account
 */
export function isPaymanConnected(): boolean {
  try {
    const tokenDataString = localStorage.getItem('payman_token');
    if (!tokenDataString) return false;

    const tokenData: PaymanTokenData = JSON.parse(tokenDataString);
    return !!(tokenData.accessToken && tokenData.expiresIn);
  } catch {
    return false;
  }
}

/**
 * Clear stored Payman token (for logout/disconnect)
 */
export function clearPaymanToken(): void {
  localStorage.removeItem('payman_token');
}

/**
 * Get client credentials PaymanClient for server-side operations
 * This should only be used in API routes, not in frontend code
 */
export function getServerPaymanClient(): Payman.PaymanClient {
  const clientId = process.env.VITE_PAYMAN_CLIENT_ID;
  const clientSecret = process.env.VITE_PAYMAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Payman client credentials in environment variables');
  }

  return Payman.PaymanClient.withClientCredentials({
    clientId,
    clientSecret,
  });
} 