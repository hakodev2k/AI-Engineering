import type { OpenMeteoConfig } from "./config.js";

export class OpenMeteoError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

export class OpenMeteoClient {
  constructor(private readonly config: OpenMeteoConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async get(baseUrl: string, path: string, params: Record<string, string | number | boolean | undefined>): Promise<unknown> {
    const url = new URL(path, baseUrl);
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));
    if (this.config.apiKey) url.searchParams.set("apikey", this.config.apiKey);

    let last: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, { headers: { accept: "application/json" }, signal: controller.signal });
        const text = await response.text();
        const body = text ? JSON.parse(text) : null;
        if (response.ok) return body;
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if (![429, 500, 502, 503, 504].includes(response.status) || attempt === this.config.maxRetries) {
          throw new OpenMeteoError(response.status, body?.reason ?? body?.error ?? `Open-Meteo HTTP ${response.status}`, retryAfter);
        }
        last = new OpenMeteoError(response.status, `Transient Open-Meteo HTTP ${response.status}`, retryAfter);
        const waitMs = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(2000, 200 * 2 ** attempt);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      } catch (error) {
        if (error instanceof OpenMeteoError) throw error;
        if (attempt === this.config.maxRetries) throw error;
        last = error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(2000, 200 * 2 ** attempt)));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error("Open-Meteo request failed");
  }
}
