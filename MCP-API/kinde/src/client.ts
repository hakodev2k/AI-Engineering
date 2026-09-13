import type { KindeConfig } from "./config.js";

export class KindeApiError extends Error {
  constructor(public status: number, message: string, public retryAfterSeconds?: number) { super(message); }
}

type Query = Record<string, string | number | boolean | undefined>;
type RequestOptions = { method?: "GET" | "POST" | "PATCH"; body?: unknown; query?: Query };

export class KindeClient {
  private token?: { value: string; expiresAt: number };
  constructor(private readonly config: KindeConfig, private readonly fetchFn: typeof fetch = fetch) {}

  private async fetchWithTimeout(input: string | URL, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try { return await this.fetchFn(input, { ...init, signal: controller.signal }); }
    finally { clearTimeout(timer); }
  }

  private async accessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - 60_000) return this.token.value;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      audience: this.config.audience
    });
    if (this.config.scopes) body.set("scope", this.config.scopes);
    const response = await this.fetchWithTimeout(`${this.config.domain}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) as { access_token?: string; expires_in?: number; error?: string; error_description?: string } : {};
    if (!response.ok || !data.access_token) throw new KindeApiError(response.status, `Kinde OAuth failed: ${data.error_description ?? data.error ?? response.statusText}`);
    this.token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
    return data.access_token;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith("/")) throw new Error("Internal Kinde API path must start with '/'");
    const method = options.method ?? "GET";
    const url = new URL(`${this.config.domain}/api/v1${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const maxAttempts = method === "GET" ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const token = await this.accessToken();
        const response = await this.fetchWithTimeout(url, {
          method,
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) as unknown : undefined;
        if (response.ok) return data as T;
        const resetHeader = response.headers.get("ratelimit-reset");
        const retryAfterSeconds = resetHeader && /^\d+$/.test(resetHeader) ? Number(resetHeader) : undefined;
        const providerMessage = data && typeof data === "object" && "message" in data ? String((data as { message: unknown }).message) : `Kinde API error ${response.status}`;
        const error = new KindeApiError(response.status, providerMessage, retryAfterSeconds);
        if (method !== "GET" || ![429, 500, 502, 503, 504].includes(response.status) || attempt + 1 >= maxAttempts) throw error;
        const delay = retryAfterSeconds !== undefined ? retryAfterSeconds * 1000 : Math.min(4000, 250 * (2 ** attempt)) + Math.floor(Math.random() * 100);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        lastError = error;
        if (error instanceof KindeApiError || attempt + 1 >= maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(4000, 250 * (2 ** attempt))));
      }
    }
    throw lastError;
  }
}

const secretKeys = new Set(["access_token", "refresh_token", "client_secret", "password", "hashed_password", "secret"]);
export function sanitizeProviderData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeProviderData);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, secretKeys.has(key.toLowerCase()) ? "[REDACTED]" : sanitizeProviderData(child)]));
  }
  return value;
}
