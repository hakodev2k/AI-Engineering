import { basicAuthHeader, type AblyAuthConfig } from "./auth.js";

export class AblyApiError extends Error {
  constructor(public status: number, public code: number | undefined, message: string, public retryAfterMs?: number) { super(message); }
}

export interface AblyClientConfig extends AblyAuthConfig {
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class AblyClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  constructor(private readonly config: AblyClientConfig, private readonly fetcher: typeof fetch = fetch) {
    this.baseUrl = (config.baseUrl ?? "https://rest.ably.io").replace(/\/$/, "");
    this.timeoutMs = config.timeoutMs ?? 15000;
    this.maxRetries = Math.max(0, Math.min(config.maxRetries ?? 3, 5));
    if (!this.baseUrl.startsWith("https://")) throw new Error("ABLY_REST_BASE_URL must use HTTPS");
  }

  async request<T>(method: "GET" | "POST", path: string, query?: Record<string, string | number | undefined>, body?: unknown): Promise<{ data: T; next?: string }> {
    const url = new URL(path, `${this.baseUrl}/`);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryableMethod = method === "GET";
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await this.fetcher(url, {
          method,
          headers: { Authorization: basicAuthHeader(this.config), Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        const parsed = text ? JSON.parse(text) : null;
        if (res.ok) return { data: parsed as T, next: parseNext(res.headers.get("link"), this.baseUrl) };
        const code = typeof parsed?.code === "number" ? parsed.code : undefined;
        const message = parsed?.message ?? `Ably request failed with HTTP ${res.status}`;
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        const retryable = retryableMethod && (res.status === 429 || res.status >= 500) && attempt < this.maxRetries;
        if (!retryable) throw new AblyApiError(res.status, code, message, retryAfterMs);
        await delay(retryAfterMs ?? Math.min(250 * 2 ** attempt, 4000));
        attempt++;
      } catch (error) {
        if (error instanceof AblyApiError) throw error;
        if (!retryableMethod || attempt >= this.maxRetries) {
          if ((error as Error).name === "AbortError") throw new Error(`Ably request timed out after ${this.timeoutMs}ms`);
          throw error;
        }
        await delay(Math.min(250 * 2 ** attempt, 4000));
        attempt++;
      } finally { clearTimeout(timer); }
    }
  }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function parseNext(link: string | null, baseUrl: string): string | undefined {
  if (!link) return undefined;
  for (const part of link.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) {
      const url = new URL(match[1], `${baseUrl}/`);
      if (url.origin !== new URL(baseUrl).origin) throw new Error("Rejected cross-origin pagination URL");
      return `${url.pathname}${url.search}`;
    }
  }
  return undefined;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
