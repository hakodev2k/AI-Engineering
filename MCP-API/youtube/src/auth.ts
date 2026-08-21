import type { YouTubeConfig } from "./config.js";

export class OAuthTokenProvider {
  private accessToken?: string;
  private expiresAt = 0;

  constructor(private readonly config: YouTubeConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.accessToken = config.accessToken;
  }

  hasOAuth(): boolean {
    return Boolean(this.accessToken || this.config.refreshToken);
  }

  async getAccessToken(forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.accessToken && (this.expiresAt === 0 || Date.now() < this.expiresAt - 60_000)) {
      return this.accessToken;
    }
    if (!this.config.refreshToken || !this.config.clientId || !this.config.clientSecret) {
      if (this.accessToken && !forceRefresh) return this.accessToken;
      throw new Error("OAuth access token is required for this operation");
    }

    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.config.refreshToken,
      grant_type: "refresh_token",
    });
    const response = await this.fetchImpl("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await response.json() as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
    if (!response.ok || !data.access_token) {
      throw new Error(`OAuth refresh failed (${response.status}): ${data.error_description ?? data.error ?? "unknown error"}`);
    }
    this.accessToken = data.access_token;
    this.expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
    return data.access_token;
  }
}
