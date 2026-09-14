import type { Config } from './config.js';

type FetchLike = typeof fetch;

export class GoogleTokenProvider {
  private cached?: { token: string; expiresAt: number };
  constructor(private readonly config: Config, private readonly fetchImpl: FetchLike = fetch) {}

  invalidate() { this.cached = undefined; }

  async getToken(): Promise<string> {
    if (this.cached && this.cached.expiresAt > Date.now() + 60_000) return this.cached.token;
    if (this.config.refreshToken && this.config.clientId && this.config.clientSecret) {
      const body = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token'
      });
      const response = await this.fetchImpl(this.config.tokenUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(this.config.timeoutMs)
      });
      if (!response.ok) throw new Error(`Google OAuth token refresh failed (${response.status}); user action may be required`);
      const data = await response.json() as { access_token?: string; expires_in?: number };
      if (!data.access_token) throw new Error('Google OAuth response did not contain access_token');
      this.cached = { token: data.access_token, expiresAt: Date.now() + Math.max(60, data.expires_in ?? 3600) * 1000 };
      return this.cached.token;
    }
    if (this.config.accessToken) return this.config.accessToken;
    throw new Error('Google OAuth credentials are unavailable');
  }
}
