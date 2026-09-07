import type { Config } from "./config.js";

export class ShippoError extends Error {
  constructor(message: string, public readonly status: number, public readonly retryAfter?: number) { super(message); this.name = "ShippoError"; }
}

export class ShippoClient {
  constructor(private readonly config: Config, private readonly fetcher: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    if (!path.startsWith("/")) throw new Error("Shippo path must be relative");
    const url = new URL(path, `${this.config.baseUrl}/`);
    if (url.origin !== this.config.baseUrl) throw new Error("Cross-origin Shippo request rejected");
    const retryable = method === "GET" || method === "HEAD";
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const response = await this.fetcher(url, {
          method,
          headers: {
            Authorization: `ShippoToken ${this.config.token}`,
            "Content-Type": "application/json",
            "Shippo-API-Version": this.config.apiVersion,
            "User-Agent": "ai-engineering-shippo-mcp/1.0"
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (response.ok) return data as T;
        const retryAfter = Number(response.headers.get("retry-after") ?? "0") || undefined;
        const canRetry = retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
        if (canRetry) {
          const wait = Math.min((retryAfter ?? 2 ** attempt) * 1000, 10000);
          await new Promise(resolve => setTimeout(resolve, wait));
          continue;
        }
        throw new ShippoError(`Shippo API ${response.status}: ${text.slice(0, 1000)}`, response.status, retryAfter);
      } catch (error) {
        if (error instanceof ShippoError) throw error;
        if (signal?.aborted) throw new Error("Shippo request cancelled");
        if (error instanceof Error && error.name === "AbortError") throw new Error("Shippo request timed out");
        if (retryable && attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.min(2 ** attempt * 500, 5000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", onAbort);
      }
    }
  }

  list<T>(path: string, page = 1, results = 20) { return this.request<T>("GET", `${path}?page=${page}&results=${results}`); }
}
