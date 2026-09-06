import type { Config } from "./config.js";

export interface CredentialProvider {
  getAccessToken(): Promise<string>;
  refresh(): Promise<string | null>;
}

export class EnvCredentialProvider implements CredentialProvider {
  private accessToken: string;
  private refreshToken?: string;

  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  async getAccessToken(): Promise<string> {
    return this.accessToken;
  }

  async refresh(): Promise<string | null> {
    if (!(this.refreshToken && this.config.clientId && this.config.clientSecret)) return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetchImpl(`${this.config.baseUrl}/oauth/token`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          refresh_token: this.refreshToken,
          grant_type: "refresh_token"
        })
      });
      const body = await response.json() as { access_token?: string; refresh_token?: string };
      if (!response.ok || !body.access_token) throw new Error(`Gusto OAuth refresh failed with status ${response.status}.`);
      this.accessToken = body.access_token;
      if (body.refresh_token) this.refreshToken = body.refresh_token;
      return this.accessToken;
    } finally {
      clearTimeout(timer);
    }
  }
}
