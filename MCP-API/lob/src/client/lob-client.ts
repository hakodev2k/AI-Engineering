import type { LobConfig } from "../auth/config.js";

export class LobApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown, public retryAfterMs?: number) {
    super(message);
    this.name = "LobApiError";
  }
}

export class LobClient {
  constructor(private readonly config: LobConfig, private readonly fetchFn: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; idempotencyKey?: string; signal?: AbortSignal } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const isRead = method === "GET" || method === "HEAD";
    const canRetry = isRead || (method === "POST" && !!options.idempotencyKey);
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      options.signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const headers: Record<string, string> = {
          Authorization: `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Lob-Version": this.config.apiVersion,
          "User-Agent": "ai-engineering-lob-mcp/1.0.0",
        };
        if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;
        const response = await this.fetchFn(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal,
        });
        const text = await response.text();
        const data = text ? safeJson(text) : null;
        if (response.ok) return data as T;

        const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"), response.headers.get("ratelimit-reset"));
        const message = extractMessage(data) ?? `Lob API request failed with HTTP ${response.status}`;
        if (canRetry && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfterMs ?? Math.min(250 * 2 ** attempt, 4000);
          attempt += 1;
          await sleep(delay, options.signal);
          continue;
        }
        throw new LobApiError(response.status, message, data, retryAfterMs);
      } catch (error) {
        if (error instanceof LobApiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new Error("Lob API request timed out or was cancelled");
        if (canRetry && attempt < this.config.maxRetries) {
          const delay = Math.min(250 * 2 ** attempt, 4000);
          attempt += 1;
          await sleep(delay, options.signal);
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener("abort", onAbort);
      }
    }
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text }; } }
function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  if (typeof d.error === "object" && d.error && typeof (d.error as Record<string, unknown>).message === "string") return (d.error as Record<string, string>).message;
  if (typeof d.message === "string") return d.message;
  return undefined;
}
function parseRetryAfter(retryAfter: string | null, reset: string | null): number | undefined {
  if (retryAfter && /^\d+$/.test(retryAfter)) return Number(retryAfter) * 1000;
  if (reset && /^\d+$/.test(reset)) return Math.max(0, Number(reset) * 1000 - Date.now());
  return undefined;
}
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });
}
