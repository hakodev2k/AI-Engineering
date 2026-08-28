export class DatabricksTokenProvider {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.cached = null;
    this.refreshPromise = null;
  }

  async getAccessToken(signal) {
    if (this.config.authMode === "pat") return this.config.token;
    const now = Date.now();
    if (this.cached && this.cached.expiresAt - now > 60_000) return this.cached.token;
    if (!this.refreshPromise) {
      this.refreshPromise = this.fetchOAuthToken(signal).finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  async fetchOAuthToken(signal) {
    const body = new URLSearchParams({ grant_type: "client_credentials", scope: "all-apis" });
    const timeout = AbortSignal.timeout(this.config.timeoutMs);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64");
    const response = await this.fetch(`${this.config.host}/oidc/v1/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body,
      signal: combined
    });
    const text = await response.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || `Databricks OAuth token request failed with HTTP ${response.status}`);
    }
    const expiresIn = Number(data.expires_in || 3600);
    this.cached = {
      token: data.access_token,
      expiresAt: Date.now() + Math.max(60, expiresIn) * 1000
    };
    return this.cached.token;
  }

  invalidate() {
    this.cached = null;
  }
}
