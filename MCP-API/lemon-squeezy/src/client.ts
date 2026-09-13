import type { LemonSqueezyConfig } from "./config.js";

export class LemonSqueezyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details: unknown,
    public readonly retryAfterSeconds?: number
  ) { super(message); }
}

type Query = Record<string, string | number | boolean | undefined>;

export class LemonSqueezyClient {
  constructor(private readonly config: LemonSqueezyConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async get(path: string, query: Query = {}): Promise<unknown> {
    return this.request("GET", path, undefined, query, true);
  }

  async post(path: string, body: unknown): Promise<unknown> {
    return this.request("POST", path, body, {}, false);
  }

  async patch(path: string, body: unknown): Promise<unknown> {
    return this.request("PATCH", path, body, {}, false);
  }

  private async request(method: string, path: string, body?: unknown, query: Query = {}, retryable = false): Promise<unknown> {
    if (!path.startsWith("/")) throw new Error("Provider path must be absolute");
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, String(value));

    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "Authorization": `Bearer ${this.config.apiKey}`,
            "User-Agent": "daily-mcp-lemon-squeezy/1.0"
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (response.ok) return data;

        const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
        const mayRetry = retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
        if (!mayRetry) throw new LemonSqueezyError(`Lemon Squeezy API returned ${response.status}`, response.status, data, Number.isFinite(retryAfter) ? retryAfter : undefined);

        const delayMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.min(4000, 250 * 2 ** attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        attempt += 1;
      } catch (error) {
        if (error instanceof LemonSqueezyError) throw error;
        if (retryable && attempt < this.config.maxRetries && !(error instanceof SyntaxError)) {
          await new Promise((resolve) => setTimeout(resolve, Math.min(4000, 250 * 2 ** attempt)));
          attempt += 1;
          continue;
        }
        if (error instanceof Error && error.name === "AbortError") throw new Error(`Lemon Squeezy request timed out after ${this.config.timeoutMs}ms`);
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
