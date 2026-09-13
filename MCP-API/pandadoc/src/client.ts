import type { Config } from "./config.js";

export class PandaDocError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public requestId?: string) {
    super(message);
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  retryable?: boolean;
}

function delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }

export class PandaDocClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }

    const method = options.method ?? "GET";
    const retryable = options.retryable ?? method === "GET";
    let attempt = 0;

    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `API-Key ${this.config.apiKey}`,
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });

        const requestId = response.headers.get("x-request-id") ?? response.headers.get("x-pandadoc-request-id") ?? undefined;
        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
        const text = await response.text();
        const data = text ? safeParse(text) : undefined;

        if (response.ok) return data as T;

        const message = typeof data === "object" && data && "detail" in data
          ? String((data as Record<string, unknown>).detail)
          : `PandaDoc API returned ${response.status}`;
        const error = new PandaDocError(response.status, message, retryAfter, requestId);

        const canRetry = retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
        if (!canRetry) throw error;
        const waitMs = Number.isFinite(retryAfter) ? Math.min(retryAfter! * 1000, 30000) : Math.min(500 * 2 ** attempt, 8000);
        attempt += 1;
        await delay(waitMs);
      } catch (error) {
        if (error instanceof PandaDocError) throw error;
        const canRetry = retryable && attempt < this.config.maxRetries && (error instanceof TypeError || (error instanceof DOMException && error.name === "AbortError"));
        if (!canRetry) throw new Error(error instanceof DOMException && error.name === "AbortError" ? "PandaDoc request timed out" : `PandaDoc network error: ${String(error)}`);
        attempt += 1;
        await delay(Math.min(500 * 2 ** (attempt - 1), 8000));
      } finally {
        clearTimeout(timer);
      }
    }
  }
}

function safeParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text.slice(0, 200_000) }; }
}
