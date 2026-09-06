import type { Config } from "./config.js";

export class GreenhouseAuthError extends Error {}

type Token = { access_token: string; token_type?: string; expires_in?: number };

export class GreenhouseTokenProvider {
  private token?: { value: string; expiresAt: number };
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  invalidate() { this.token = undefined; }

  async getToken(): Promise<string> {
    const now = Date.now();
    if (this.token && this.token.expiresAt - 30_000 > now) return this.token.value;

    const form = new URLSearchParams({ grant_type: "client_credentials" });
    if (this.config.subUserId) form.set("sub", this.config.subUserId);
    const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetchImpl(`${this.config.authBaseUrl}/token`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: form.toString()
      });
      const text = await response.text();
      let body: unknown = text;
      if (text) { try { body = JSON.parse(text); } catch {} }
      if (!response.ok) throw new GreenhouseAuthError(`OAuth token request failed (${response.status}).`);
      const parsed = body as Token;
      if (!parsed.access_token) throw new GreenhouseAuthError("OAuth response did not contain access_token.");
      this.token = { value: parsed.access_token, expiresAt: now + Math.max(60, parsed.expires_in ?? 300) * 1000 };
      return this.token.value;
    } finally {
      clearTimeout(timer);
    }
  }
}
