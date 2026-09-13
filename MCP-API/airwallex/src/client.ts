import type { AirwallexConfig } from "./config.js";

interface TokenState { token: string; expiresAt: number; }

export class AirwallexError extends Error {
  constructor(public status: number, message: string, public body?: unknown, public retryAfter?: string | null) {
    super(message);
  }
}

export class AirwallexClient {
  private token?: TokenState;
  constructor(private readonly config: AirwallexConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async accessToken(): Promise<string> {
    if (this.token && this.token.expiresAt - Date.now() > 60_000) return this.token.token;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await this.fetchImpl(`${this.config.baseUrl}/api/v1/authentication/login`, {
        method: "POST",
        headers: {
          "x-client-id": this.config.clientId,
          "x-api-key": this.config.apiKey,
          ...(this.config.loginAs ? { "x-login-as": this.config.loginAs } : {})
        },
        signal: controller.signal
      });
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      if (!response.ok) throw new AirwallexError(response.status, `Authentication failed (${response.status})`, body, response.headers.get("retry-after"));
      const token = String(body.token ?? "");
      if (!token) throw new Error("Authentication response did not include a token");
      const expiresRaw = body.expires_at;
      const expiresAt = typeof expiresRaw === "string" ? Date.parse(expiresRaw) : Date.now() + 25 * 60_000;
      this.token = { token, expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + 25 * 60_000 };
      return token;
    } finally { clearTimeout(timer); }
  }

  async request<T>(method: string, path: string, options: { query?: Record<string, unknown>; body?: unknown; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    const maxAttempts = (options.retryable ?? method === "GET") ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.accessToken();
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-version": this.config.apiVersion
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        const body = text ? JSON.parse(text) : null;
        if (response.ok) return body as T;
        if (response.status === 401) this.token = undefined;
        const error = new AirwallexError(response.status, `Airwallex API error ${response.status}`, body, response.headers.get("retry-after"));
        if (!(options.retryable ?? method === "GET") || ![429, 500, 502, 503, 504].includes(response.status) || attempt === maxAttempts - 1) throw error;
        const retryAfter = Number(response.headers.get("retry-after"));
        const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 500 * 2 ** attempt + Math.floor(Math.random() * 250));
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        lastError = error;
        if (error instanceof AirwallexError) throw error;
        if (attempt === maxAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 500 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
    throw lastError ?? new Error("Airwallex request failed");
  }
}
