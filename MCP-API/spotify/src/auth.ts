import type { SpotifyConfig } from './config.js';

export class SpotifyTokenProvider {
  private token?: string;
  private expiresAt = 0;
  constructor(private readonly config: SpotifyConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.token = config.accessToken;
    this.expiresAt = config.accessToken ? Number.POSITIVE_INFINITY : 0;
  }

  async getToken(forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.token && Date.now() < this.expiresAt - 30_000) return this.token;
    const { clientId, clientSecret, refreshToken, tokenUrl } = this.config;
    if (!(clientId && clientSecret && refreshToken)) {
      if (this.token) return this.token;
      throw new Error('Spotify OAuth refresh credentials are unavailable');
    }
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken });
    const res = await this.fetchImpl(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });
    if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
    const json = await res.json() as { access_token?: string; expires_in?: number };
    if (!json.access_token) throw new Error('Spotify token refresh response missing access_token');
    this.token = json.access_token;
    this.expiresAt = Date.now() + Math.max(60, json.expires_in ?? 3600) * 1000;
    return this.token;
  }
}
