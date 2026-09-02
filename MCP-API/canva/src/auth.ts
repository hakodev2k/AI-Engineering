import type { CanvaConfig } from './config.js';

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

export class CanvaCredentialProvider {
  private accessToken?: string;
  private refreshToken?: string;
  private expiresAt = 0;

  constructor(private readonly config: CanvaConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    if (config.accessToken) this.expiresAt = Number.POSITIVE_INFINITY;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt - 30_000) return this.accessToken;
    if (!this.refreshToken || !this.config.clientId || !this.config.clientSecret) throw new Error('Canva access token expired and refresh credentials are unavailable');
    const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: this.refreshToken });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetchImpl(`${this.config.apiBaseUrl}/oauth/token`, {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await response.json() as TokenResponse & { message?: string };
      if (!response.ok || !data.access_token) throw new Error(data.message ?? `Canva OAuth refresh failed with HTTP ${response.status}`);
      this.accessToken = data.access_token;
      if (data.refresh_token) this.refreshToken = data.refresh_token;
      this.expiresAt = Date.now() + Math.max(60, data.expires_in ?? 14400) * 1000;
      return this.accessToken;
    } finally {
      clearTimeout(timer);
    }
  }

  invalidateAccessToken(): void {
    if (this.config.refreshToken) {
      this.accessToken = undefined;
      this.expiresAt = 0;
    }
  }
}
