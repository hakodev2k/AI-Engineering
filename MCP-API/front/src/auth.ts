import type { Config } from "./config.js";

export class CredentialProvider {
  private token?: string;
  private expiresAt = 0;
  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async getAccessToken(signal?: AbortSignal): Promise<string> {
    if (this.config.staticToken) return this.config.staticToken;
    if (this.token && Date.now() < this.expiresAt - 60_000) return this.token;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId!,
      client_secret: this.config.clientSecret!
    });
    const response = await this.fetchFn(this.config.oauthUrl!, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "accept": "application/json" },
      body,
      signal
    });
    if (!response.ok) throw new Error(`Front OAuth token request failed (${response.status}).`);
    const json = await response.json() as { access_token?: string; expires_in?: number };
    if (!json.access_token) throw new Error("Front OAuth response did not contain access_token.");
    this.token = json.access_token;
    this.expiresAt = Date.now() + Math.max(60, json.expires_in ?? 900) * 1000;
    return this.token;
  }

  invalidate(): void { this.token = undefined; this.expiresAt = 0; }
}
