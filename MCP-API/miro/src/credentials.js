import fs from "node:fs/promises";
import path from "node:path";

export class CredentialProvider {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.cached = null;
  }

  async getAccessToken() {
    if (this.config.accessToken) return this.config.accessToken;
    const creds = await this.#readTokenFile();
    if (!creds.access_token) throw new Error("MIRO_TOKEN_FILE is missing access_token");

    const now = Math.floor(Date.now() / 1000);
    if (creds.expires_at && creds.expires_at <= now + 30) {
      return (await this.refresh()).access_token;
    }
    return creds.access_token;
  }

  async refresh() {
    if (this.config.accessToken) throw new Error("Static MIRO_ACCESS_TOKEN cannot be refreshed");
    const creds = await this.#readTokenFile();
    if (!creds.refresh_token) throw new Error("MIRO_TOKEN_FILE is missing refresh_token");
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error("MIRO_CLIENT_ID and MIRO_CLIENT_SECRET are required to refresh OAuth tokens");
    }

    const url = new URL("/v1/oauth/token", this.config.apiBaseUrl);
    url.searchParams.set("grant_type", "refresh_token");
    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("client_secret", this.config.clientSecret);
    url.searchParams.set("refresh_token", creds.refresh_token);

    const response = await this.fetch(url, {method: "POST", headers: {Accept: "application/json"}});
    const text = await response.text();
    let body = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = {raw: text}; }
    if (!response.ok || !body.access_token) {
      throw new Error(body.message || body.error || `Miro OAuth refresh failed with HTTP ${response.status}`);
    }

    const next = {
      access_token: body.access_token,
      refresh_token: body.refresh_token || creds.refresh_token,
      expires_at: body.expires_in ? Math.floor(Date.now() / 1000) + Number(body.expires_in) : null,
      scope: body.scope || creds.scope || null,
      token_type: body.token_type || "bearer"
    };
    await this.#writeTokenFile(next);
    this.cached = next;
    return next;
  }

  async #readTokenFile() {
    if (this.cached) return this.cached;
    const raw = await fs.readFile(this.config.tokenFile, "utf8");
    const parsed = JSON.parse(raw);
    this.cached = parsed;
    return parsed;
  }

  async #writeTokenFile(value) {
    const target = path.resolve(this.config.tokenFile);
    const temp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, {mode: 0o600});
    await fs.rename(temp, target);
  }
}
