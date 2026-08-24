import { QuickBooksConfig } from './config.js';

type TokenResponse = { access_token: string; refresh_token?: string; expires_in?: number; x_refresh_token_expires_in?: number };

export class QuickBooksTokenProvider {
  private accessToken?: string;
  private refreshToken?: string;
  private expiresAt = 0;

  constructor(private readonly config: QuickBooksConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  invalidate() { this.expiresAt = 0; if (!this.refreshToken) this.accessToken = undefined; }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt - 60_000) return this.accessToken;
    if (this.accessToken && this.expiresAt === 0 && !this.refreshToken) return this.accessToken;
    if (!this.refreshToken || !this.config.clientId || !this.config.clientSecret) {
      if (this.accessToken) return this.accessToken;
      throw new Error('QuickBooks access token unavailable');
    }
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: this.refreshToken });
    const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const res = await this.fetchImpl('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    if (!res.ok) throw new Error(`QuickBooks OAuth refresh failed: ${res.status} ${(await res.text()).slice(0, 1000)}`);
    const token = await res.json() as TokenResponse;
    this.accessToken = token.access_token;
    if (token.refresh_token) this.refreshToken = token.refresh_token;
    this.expiresAt = Date.now() + Math.max(60, token.expires_in ?? 3600) * 1000;
    return this.accessToken;
  }
}
