import type { Config } from "./config.js";

export class ClockifyApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

type RequestOptions = { method?: string; query?: Record<string, string | number | boolean | undefined>; body?: unknown; reports?: boolean; retryable?: boolean };

export class ClockifyClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request(path: string, options: RequestOptions = {}): Promise<unknown> {
    const method = options.method ?? "GET";
    const base = options.reports ? "https://reports.api.clockify.me/v1" : "https://api.clockify.me/api/v1";
    const url = new URL(base + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryable = options.retryable ?? method === "GET";
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            "X-Api-Key": this.config.apiKey,
            "Accept": "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (response.ok) {
          if (response.status === 204) return { ok: true };
          const text = await response.text();
          return text ? JSON.parse(text) : { ok: true };
        }
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        const text = await response.text();
        const error = new ClockifyApiError(response.status, text || `Clockify API error ${response.status}`, retryAfter);
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 4000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      } catch (error) {
        clearTimeout(timer);
        lastError = error;
        if (error instanceof ClockifyApiError) throw error;
        if (!retryable || attempt >= this.config.maxRetries) {
          if (error instanceof Error && error.name === "AbortError") throw new Error("Clockify request timed out.");
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 4000)));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Clockify request failed.");
  }
}
