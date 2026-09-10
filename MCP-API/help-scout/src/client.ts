import type { HelpScoutConfig } from "./config.js";
import { HelpScoutTokenProvider } from "./auth.js";

export class HelpScoutApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  idempotent?: boolean;
};

export class HelpScoutClient {
  constructor(
    private readonly config: HelpScoutConfig,
    private readonly tokens: HelpScoutTokenProvider,
    private readonly fetchFn: typeof fetch = fetch
  ) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith("/v2/") && !path.startsWith("/v3/")) throw new Error("Unsupported Help Scout API path");
    const method = options.method ?? "GET";
    const url = new URL(path, this.config.apiBase);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryable = method === "GET" || options.idempotent === true;
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const abort = () => controller.abort();
      options.signal?.addEventListener("abort", abort, { once: true });
      try {
        const token = await this.tokens.getToken(controller.signal);
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(options.body !== undefined ? { "Content-Type": "application/json" } : {})
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal,
          redirect: "manual"
        });
        const retryAfter = Number(response.headers.get("X-RateLimit-Retry-After") ?? response.headers.get("Retry-After") ?? "0") || undefined;
        if (response.status === 401) this.tokens.invalidate();
        if (!response.ok) {
          const text = await response.text();
          const error = new HelpScoutApiError(response.status, `Help Scout API ${response.status}: ${text.slice(0, 1000)}`, retryAfter);
          const canRetry = retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
          if (!canRetry) throw error;
          const delay = retryAfter ? retryAfter * 1000 : Math.min(5000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          lastError = error;
          continue;
        }
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        if (!text) {
          const resourceId = response.headers.get("Resource-Id");
          const location = response.headers.get("Location");
          return ({ resourceId, location } as unknown) as T;
        }
        return JSON.parse(text) as T;
      } catch (error) {
        lastError = error;
        if (error instanceof HelpScoutApiError) throw error;
        if (!retryable || attempt >= this.config.maxRetries || options.signal?.aborted) throw error;
        await new Promise(r => setTimeout(r, Math.min(5000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener("abort", abort);
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Help Scout request failed");
  }
}
