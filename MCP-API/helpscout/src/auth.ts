import type { Config } from "./config.js";

interface TokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export class HelpScoutTokenProvider {
  private cached?: { token: string; expiresAt: number };

  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  invalidate(): void {
    if (!this.config.accessToken) this.cached = undefined;
  }

  async getToken(): Promise<string> {
    if (this.config.accessToken) return this.config.accessToken;
    if (this.cached && Date.now() < this.cached.expiresAt - 60_000) return this.cached.token;
    if (!this.config.appId || !this.config.appSecret) throw new Error("Help Scout OAuth client credentials are not configured.");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.appId,
        client_secret: this.config.appSecret
      });
      const response = await this.fetchImpl(`${this.config.apiBase}/v2/oauth2/token`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`Help Scout OAuth token request failed (${response.status}).`);
      const token = JSON.parse(text) as TokenResponse;
      if (!token.access_token || !Number.isFinite(token.expires_in)) throw new Error("Help Scout returned an invalid OAuth token response.");
      this.cached = { token: token.access_token, expiresAt: Date.now() + token.expires_in * 1000 };
      return token.access_token;
    } finally {
      clearTimeout(timer);
    }
  }
}
