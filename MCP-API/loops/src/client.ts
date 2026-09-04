import type { Config } from "./config.js";

export class LoopsApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message); this.name = "LoopsApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  idempotencyKey?: string;
  retryRead?: boolean;
};

export class LoopsClient {
  constructor(private readonly cfg: Config, private readonly fetchFn: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? "GET";
    const url = new URL(`${this.cfg.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    if (url.origin !== new URL(this.cfg.baseUrl).origin) throw new Error("Refusing request outside configured Loops API origin.");

    const attempts = method === "GET" && options.retryRead !== false ? this.cfg.maxReadRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${this.cfg.apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        };
        if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;
        const response = await this.fetchFn(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const text = await response.text();
        let payload: unknown = null;
        if (text) {
          try { payload = JSON.parse(text); } catch { payload = { message: text }; }
        }
        if (response.ok) return payload as T;

        const msg = typeof payload === "object" && payload && "message" in payload
          ? String((payload as { message: unknown }).message)
          : `Loops API returned HTTP ${response.status}`;
        const retryable = method === "GET" && (response.status === 429 || response.status >= 500) && attempt + 1 < attempts;
        if (!retryable) throw new LoopsApiError(response.status, msg, response.headers.get("retry-after") ?? undefined);
        const retryAfter = Number(response.headers.get("retry-after"));
        const wait = Number.isFinite(retryAfter) ? Math.min(retryAfter * 1000, 5000) : Math.min(250 * 2 ** attempt, 2000);
        await new Promise((resolve) => setTimeout(resolve, wait + Math.floor(Math.random() * 100)));
      } catch (error) {
        if (error instanceof LoopsApiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new Error(`Loops API request timed out after ${this.cfg.timeoutMs}ms`);
        if (attempt + 1 >= attempts) throw error;
        await new Promise((resolve) => setTimeout(resolve, Math.min(250 * 2 ** attempt, 2000)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error("Unreachable retry state");
  }
}
