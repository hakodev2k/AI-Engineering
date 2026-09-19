import type { Config } from "./config.js";

export class GrowthBookError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GrowthBookClient {
  constructor(private readonly config: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async request(method: "GET" | "POST", path: string, body?: unknown, signal?: AbortSignal): Promise<unknown> {
    if (!path.startsWith("/api/")) throw new Error("Only GrowthBook /api/ paths are allowed");
    const target = new URL(path, `${this.config.apiUrl}/`);
    if (target.origin !== new URL(this.config.apiUrl).origin) throw new Error("Cross-origin requests are forbidden");

    const retryable = method === "GET";
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error("GrowthBook request timed out")), this.config.timeoutMs);
      const abort = () => controller.abort(signal?.reason);
      signal?.addEventListener("abort", abort, { once: true });
      try {
        const response = await this.fetchFn(target, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return { text }; } })() : null;
        if (response.ok) return data;
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if (retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500)) {
          const wait = retryAfter ? Math.min(Number(retryAfter) * 1000 || 0, 30000) : Math.min(500 * 2 ** attempt, 5000);
          await sleep(wait);
          continue;
        }
        const message = typeof data === "object" && data && "message" in data ? String((data as {message: unknown}).message) : `GrowthBook API returned ${response.status}`;
        throw new GrowthBookError(response.status, message, retryAfter);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
      }
    }
  }
}
