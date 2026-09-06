import type { Config } from "./config.js";
import { HelpScoutTokenProvider } from "./auth.js";

export class HelpScoutApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfter?: string,
    public readonly location?: string
  ) {
    super(message);
    this.name = "HelpScoutApiError";
  }
}

export interface HelpScoutResponse<T = unknown> {
  data: T;
  meta: {
    resourceId?: string;
    location?: string;
    webLocation?: string;
    rateLimit?: string;
    rateRemaining?: string;
    rateRetryAfter?: string;
  };
}

export class HelpScoutClient {
  constructor(
    private readonly config: Config,
    private readonly tokens = new HelpScoutTokenProvider(config),
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request<T = unknown>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>
  ): Promise<HelpScoutResponse<T>> {
    if (!path.startsWith("/v2/") && !path.startsWith("/v3/")) throw new Error("Only Help Scout v2/v3 API paths are allowed.");
    const url = new URL(this.config.apiBase + path);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const safeToRetry = method === "GET";
    let attempt = 0;
    let authRetried = false;
    while (true) {
      const token = await this.tokens.getToken();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          redirect: "manual",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json, application/hal+json",
            ...(body === undefined ? {} : { "Content-Type": method === "PATCH" ? "application/json-patch+json" : "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });

        if (response.status === 401 && !this.config.accessToken && !authRetried) {
          this.tokens.invalidate();
          authRetried = true;
          continue;
        }

        if (response.status >= 300 && response.status < 400) {
          throw new HelpScoutApiError(response.status, "Help Scout returned a redirect; merged/moved resources must be re-fetched explicitly.", undefined, response.headers.get("location") ?? undefined);
        }

        const text = await response.text();
        let data: unknown = undefined;
        if (text) {
          try { data = JSON.parse(text); } catch { data = text; }
        }

        if (response.ok) {
          return {
            data: data as T,
            meta: {
              resourceId: response.headers.get("resource-id") ?? undefined,
              location: response.headers.get("location") ?? undefined,
              webLocation: response.headers.get("web-location") ?? undefined,
              rateLimit: response.headers.get("x-ratelimit-limit-minute") ?? undefined,
              rateRemaining: response.headers.get("x-ratelimit-remaining-minute") ?? undefined,
              rateRetryAfter: response.headers.get("x-ratelimit-retry-after") ?? undefined
            }
          };
        }

        const retryHeader = response.headers.get("x-ratelimit-retry-after") ?? response.headers.get("retry-after") ?? undefined;
        if (safeToRetry && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const seconds = retryHeader && /^\d+(\.\d+)?$/.test(retryHeader) ? Number(retryHeader) : undefined;
          const delayMs = seconds !== undefined ? Math.min(seconds * 1000, 30_000) : Math.min(250 * 2 ** attempt, 4_000);
          attempt += 1;
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }

        const message = typeof data === "string" ? data : JSON.stringify(data ?? { status: response.status });
        throw new HelpScoutApiError(response.status, message, retryHeader, response.headers.get("location") ?? undefined);
      } catch (error) {
        if (safeToRetry && !(error instanceof HelpScoutApiError) && attempt < this.config.maxRetries) {
          const delayMs = Math.min(250 * 2 ** attempt, 4_000);
          attempt += 1;
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
