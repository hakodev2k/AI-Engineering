import type { Config } from "./config.js";

export class OpenWeatherApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
  }
}

export class OpenWeatherClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async get(path: string, params: Record<string, string | number | undefined> = {}) {
    const url = new URL(path, this.config.baseUrl);
    for (const [k, v] of Object.entries(params)) if (v !== undefined) url.searchParams.set(k, String(v));
    url.searchParams.set("appid", this.config.apiKey);

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, { method: "GET", signal: controller.signal, headers: { Accept: "application/json" } });
        const text = await response.text();
        let body: unknown;
        try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
        if (response.ok) return { data: body, source: "untrusted_provider_data" as const };
        const retryAfter = response.headers.get("retry-after") || undefined;
        const message = typeof body === "object" && body && "message" in body ? String((body as any).message) : `OpenWeather HTTP ${response.status}`;
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter ? Math.min(Number(retryAfter) * 1000 || 0, 30000) : Math.min(500 * 2 ** attempt, 8000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new OpenWeatherApiError(response.status, message, retryAfter);
      } catch (error) {
        lastError = error;
        if (error instanceof OpenWeatherApiError) throw error;
        if (attempt >= this.config.maxRetries) throw error;
        await new Promise(r => setTimeout(r, Math.min(500 * 2 ** attempt, 8000)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
