import type { HelpScoutConfig } from "./config.js";

export class HelpScoutTokenProvider {
  private token?: string;
  private expiresAt = 0;

  constructor(private readonly config: HelpScoutConfig, private readonly fetchFn: typeof fetch = fetch) {
    this.token = config.accessToken;
  }

  async getToken(signal?: AbortSignal): Promise<string> {
    if (this.config.accessToken) return this.config.accessToken;
    if (this.token && Date.now() < this.expiresAt - 30_000) return this.token;
    if (!this.config.clientId || !this.config.clientSecret) throw new Error("Help Scout OAuth credentials are not configured");

    const response = await this.fetchFn(`${this.config.apiBase}/v2/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      }),
      signal
    });
    if (!response.ok) throw new Error(`Help Scout OAuth token request failed (${response.status})`);
    const body = await response.json() as { access_token?: string; expires_in?: number };
    if (!body.access_token) throw new Error("Help Scout OAuth response did not contain access_token");
    this.token = body.access_token;
    this.expiresAt = Date.now() + Math.max(60, body.expires_in ?? 3600) * 1000;
    return this.token;
  }

  invalidate(): void {
    if (!this.config.accessToken) {
      this.token = undefined;
      this.expiresAt = 0;
    }
  }
}
