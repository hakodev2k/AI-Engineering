import type { PayPalConfig } from "./config.js";

type CachedToken = { token: string; expiresAt: number; scope: string };

export class PayPalTokenProvider {
  private cached?: CachedToken;

  constructor(private readonly config: PayPalConfig) {}

  async getToken(forceRefresh = false): Promise<string> {
    const now = Date.now();
    if (!forceRefresh && this.cached && this.cached.expiresAt > now + 60_000) {
      return this.cached.token;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`, "utf8").toString("base64");
      const response = await fetch(this.config.oauthEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
        signal: controller.signal
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`PayPal OAuth failed (${response.status}): ${body.slice(0, 500)}`);
      }

      const data = await response.json() as { access_token?: string; expires_in?: number; scope?: string };
      if (!data.access_token || !data.expires_in) {
        throw new Error("PayPal OAuth response did not include access_token/expires_in.");
      }

      this.cached = {
        token: data.access_token,
        expiresAt: now + Math.max(60, data.expires_in - 60) * 1000,
        scope: data.scope ?? ""
      };
      return data.access_token;
    } finally {
      clearTimeout(timer);
    }
  }

  getCachedScopes(): string[] {
    return this.cached?.scope.split(/\s+/).filter(Boolean) ?? [];
  }
}
