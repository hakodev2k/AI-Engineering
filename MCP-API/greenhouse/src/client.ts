import type { Config } from "./config.js";
import { GreenhouseTokenProvider } from "./auth.js";

export class GreenhouseApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: string) {
    super(message); this.name = "GreenhouseApiError";
  }
}

function nextCursor(link: string | null): string | undefined {
  if (!link) return undefined;
  for (const part of link.split(",")) {
    if (!/rel="next"/.test(part)) continue;
    const m = part.match(/<([^>]+)>/);
    if (!m?.[1]) continue;
    const cursor = new URL(m[1]).searchParams.get("cursor");
    if (cursor) return cursor;
  }
  return undefined;
}

export class GreenhouseClient {
  constructor(
    private readonly config: Config,
    private readonly tokens: GreenhouseTokenProvider,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request(method: "GET" | "POST", path: string, body?: unknown, query?: Record<string, string | undefined>) {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, value);
    const safe = method === "GET";
    let attempt = 0;
    let refreshed = false;

    while (true) {
      const token = await this.tokens.getToken();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let data: unknown = text;
        if (text) { try { data = JSON.parse(text); } catch {} }

        if (response.ok) {
          return {
            data,
            meta: {
              nextCursor: nextCursor(response.headers.get("link")),
              rateLimitLimit: response.headers.get("x-ratelimit-limit"),
              rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
              rateLimitReset: response.headers.get("x-ratelimit-reset")
            }
          };
        }

        if (response.status === 401 && !refreshed) {
          this.tokens.invalidate(); refreshed = true; continue;
        }

        if (safe && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const delay = retryAfter && /^\d+$/.test(retryAfter)
            ? Number(retryAfter) * 1000
            : Math.min(250 * (2 ** attempt), 4000);
          attempt++;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw new GreenhouseApiError(
          response.status,
          typeof data === "string" ? data : JSON.stringify(data),
          response.headers.get("retry-after") ?? undefined
        );
      } catch (error) {
        if (safe && !(error instanceof GreenhouseApiError) && attempt < this.config.maxRetries) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.min(250 * (2 ** (attempt - 1)), 4000)));
          continue;
        }
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
