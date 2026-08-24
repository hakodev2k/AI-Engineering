import { RedditConfig } from './config.js';

export class RedditAuth {
  private accessToken?: string;
  constructor(private readonly config: RedditConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.accessToken = config.accessToken;
  }

  async getAccessToken(forceRefresh = false): Promise<string> {
    if (this.accessToken && !forceRefresh) return this.accessToken;
    if (!this.config.refreshToken || !this.config.clientId || !this.config.clientSecret) throw new Error('No refreshable Reddit OAuth credentials configured');
    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: this.config.refreshToken });
    const res = await this.fetchImpl(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.config.userAgent
      },
      body
    });
    if (!res.ok) throw new Error(`Reddit OAuth refresh failed with HTTP ${res.status}`);
    const data = await res.json() as { access_token?: string };
    if (!data.access_token) throw new Error('Reddit OAuth refresh response did not include access_token');
    this.accessToken = data.access_token;
    return this.accessToken;
  }
}
