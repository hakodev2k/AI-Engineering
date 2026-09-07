import type { Config } from "./config.js";

export class StatsigApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

type FetchLike = typeof fetch;

export class StatsigClient {
  constructor(private config: Config, private fetchImpl: FetchLike = fetch) {}

  async request(method: "GET" | "POST" | "PATCH", path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<unknown> {
    const url = new URL(path, "https://statsigapi.net");
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const attempts = method === "GET" ? this.config.maxRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "STATSIG-API-KEY": this.config.apiKey,
            "STATSIG-API-VERSION": this.config.apiVersion
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let parsed: unknown = text;
        try { parsed = text ? JSON.parse(text) : {}; } catch { /* preserve text */ }
        if (response.ok) return { source: "untrusted_provider_data", data: parsed };
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        const message = typeof parsed === "object" && parsed && "message" in parsed ? String((parsed as {message: unknown}).message) : `Statsig API error ${response.status}`;
        if (method === "GET" && (response.status === 429 || response.status >= 500) && attempt + 1 < attempts) {
          const delay = retryAfter ? Math.min(Number(retryAfter) * 1000 || 0, 10000) : Math.min(250 * 2 ** attempt, 4000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new StatsigApiError(response.status, message, retryAfter);
      } catch (error) {
        if (error instanceof StatsigApiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new Error("Statsig request timed out.");
        if (attempt + 1 >= attempts) throw error;
        await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 4000)));
      } finally { clearTimeout(timer); }
    }
    throw new Error("Statsig request failed after bounded retries.");
  }
}
