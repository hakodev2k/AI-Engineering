import type { Config } from "./config.js";
import type { CredentialProvider } from "./auth.js";

export class GustoApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: string) {
    super(message);
    this.name = "GustoApiError";
  }
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  retryAuth?: boolean;
}

export class GustoClient {
  constructor(
    private readonly config: Config,
    private readonly credentials: CredentialProvider,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request(method: string, path: string, options: RequestOptions = {}): Promise<unknown> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    const safeToRetry = method === "GET" || method === "HEAD";
    let attempts = 0;
    let authRetried = false;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.credentials.getAccessToken();
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "X-Gusto-API-Version": this.config.apiVersion,
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        let data: unknown = null;
        if (text) {
          try { data = JSON.parse(text); } catch { data = text; }
        }
        if (response.ok) {
          return {
            data,
            meta: {
              rateLimitLimit: response.headers.get("x-ratelimit-limit"),
              rateLimitRemaining: response.headers.get("x-ratelimit-remaining"),
              rateLimitReset: response.headers.get("x-ratelimit-reset")
            }
          };
        }
        if (response.status === 401 && !authRetried && options.retryAuth !== false) {
          authRetried = true;
          const refreshed = await this.credentials.refresh();
          if (refreshed) continue;
        }
        if (safeToRetry && (response.status === 429 || response.status >= 500) && attempts < this.config.maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const delay = retryAfter && /^\d+$/.test(retryAfter)
            ? Number(retryAfter) * 1000
            : Math.min(250 * 2 ** attempts, 2000);
          attempts += 1;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new GustoApiError(response.status, typeof data === "string" ? data : JSON.stringify(data), response.headers.get("retry-after") ?? undefined);
      } catch (error) {
        if (safeToRetry && !(error instanceof GustoApiError) && attempts < this.config.maxRetries) {
          attempts += 1;
          await new Promise((resolve) => setTimeout(resolve, Math.min(250 * 2 ** (attempts - 1), 2000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
