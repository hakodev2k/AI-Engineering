import type { HubSpotConfig } from './config.js';

type TokenResponse = { access_token?: string; expires_in?: number };

export class HubSpotCredentialProvider {
  private token?: string;
  private expiresAt = 0;

  constructor(private readonly config: HubSpotConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.token = config.accessToken;
    if (this.token) this.expiresAt = Number.MAX_SAFE_INTEGER;
  }

  async getToken(forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.token && Date.now() < this.expiresAt - 30_000) return this.token;
    if (!(this.config.clientId && this.config.clientSecret && this.config.refreshToken)) {
      if (this.token) return this.token;
      throw new Error('AUTH_ERROR: OAuth refresh credentials are not configured');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.config.refreshToken
    });
    const response = await this.fetchImpl('https://api.hubapi.com/oauth/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!response.ok) throw new Error(`AUTH_ERROR: HubSpot token refresh failed with HTTP ${response.status}`);
    const data = await response.json() as TokenResponse;
    if (!data.access_token) throw new Error('AUTH_ERROR: HubSpot token refresh returned no access_token');
    this.token = data.access_token;
    this.expiresAt = Date.now() + Math.max(60, data.expires_in ?? 1800) * 1000;
    return this.token;
  }
}
