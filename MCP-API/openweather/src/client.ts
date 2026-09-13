import type { OpenWeatherConfig } from "./config.js";

export class OpenWeatherError extends Error {
  constructor(message: string, public readonly status?: number, public readonly retryAfter?: number) { super(message); }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class OpenWeatherClient {
  constructor(private readonly config: OpenWeatherConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async get<T>(path: string, params: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<T> {
    const url = new URL(path.startsWith("http") ? path : `${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));
    url.searchParams.set("appid", this.config.apiKey);

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const response = await this.fetchImpl(url, { signal: controller.signal, headers: { Accept: "application/json" } });
        const retryAfter = Number(response.headers.get("retry-after") ?? "0") || undefined;
        if (response.ok) return await response.json() as T;
        const body = await response.text();
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          await sleep(Math.min(10_000, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
          continue;
        }
        throw new OpenWeatherError(`OpenWeather HTTP ${response.status}: ${body.slice(0, 500)}`, response.status, retryAfter);
      } catch (error) {
        if (error instanceof OpenWeatherError) throw error;
        if (signal?.aborted) throw new OpenWeatherError("Request cancelled");
        if (attempt < this.config.maxRetries) { await sleep(250 * 2 ** attempt); continue; }
        throw new OpenWeatherError(error instanceof Error ? error.message : String(error));
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", onAbort);
      }
    }
  }

  geo<T>(path: string, params: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<T> {
    return this.get<T>(`${this.config.geoBaseUrl}${path}`, params, signal);
  }
}
