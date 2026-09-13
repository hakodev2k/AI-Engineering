import type { GiphyConfig } from "./config.js";

export class GiphyError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: string) {
    super(message);
  }
}

export class GiphyClient {
  constructor(private readonly config: GiphyConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async get(path: string, params: Record<string, string | number | boolean | undefined>): Promise<unknown> {
    const url = new URL(path, this.config.baseUrl);
    url.searchParams.set("api_key", this.config.apiKey);
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, { method: "GET", signal: controller.signal, headers: { accept: "application/json" } });
        if (response.ok) return await response.json();
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const waitMs = retryAfter ? Math.min(10_000, Number(retryAfter) * 1000) : Math.min(4_000, 250 * 2 ** attempt);
          await new Promise((resolve) => setTimeout(resolve, Number.isFinite(waitMs) ? waitMs : 500));
          continue;
        }
        const text = await response.text();
        throw new GiphyError(response.status, `GIPHY API error ${response.status}: ${text.slice(0, 300)}`, retryAfter);
      } catch (error) {
        if (error instanceof GiphyError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new GiphyError(408, "GIPHY request timed out");
        if (attempt < this.config.maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, Math.min(4_000, 250 * 2 ** attempt)));
          continue;
        }
        throw new GiphyError(503, `GIPHY network failure: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
