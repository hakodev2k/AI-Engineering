import type { YouTubeConfig } from "./config.js";
import { OAuthTokenProvider } from "./auth.js";

export class ProviderError extends Error {
  constructor(message: string, public readonly status: number, public readonly retryAfter?: number) { super(message); }
}

type Query = Record<string, string | number | boolean | undefined>;
type RequestOptions = { method?: "GET" | "POST"; query?: Query; body?: unknown; auth?: "public" | "oauth" };

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class YouTubeClient {
  readonly tokens: OAuthTokenProvider;
  constructor(private readonly config: YouTubeConfig, private readonly fetchImpl: typeof fetch = fetch) {
    this.tokens = new OAuthTokenProvider(config, fetchImpl);
  }

  async data<T>(resource: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(`https://www.googleapis.com/youtube/v3/${resource}`, options);
  }

  async analytics<T>(query: Query): Promise<T> {
    return this.request<T>("https://youtubeanalytics.googleapis.com/v2/reports", { query, auth: "oauth" });
  }

  private async request<T>(baseUrl: string, options: RequestOptions): Promise<T> {
    const method = options.method ?? "GET";
    const maxAttempts = method === "GET" ? 3 : 1;
    let refreshed = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const url = new URL(baseUrl);
      for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
      const headers: Record<string, string> = { accept: "application/json" };
      const needsOAuth = options.auth === "oauth";
      if (needsOAuth || (!this.config.apiKey && this.tokens.hasOAuth())) {
        headers.authorization = `Bearer ${await this.tokens.getAccessToken(refreshed)}`;
      } else if (this.config.apiKey) {
        url.searchParams.set("key", this.config.apiKey);
      } else {
        throw new Error("No usable authentication configured");
      }
      if (options.body !== undefined) headers["content-type"] = "application/json";

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timer);
        if (method === "GET" && attempt + 1 < maxAttempts) { await sleep(250 * 2 ** attempt); continue; }
        throw error;
      }
      clearTimeout(timer);

      if (response.status === 401 && needsOAuth && !refreshed && this.config.refreshToken) {
        refreshed = true;
        await this.tokens.getAccessToken(true);
        attempt--;
        continue;
      }

      const text = await response.text();
      const payload = text ? JSON.parse(text) : {};
      if (response.ok) return payload as T;

      const retryAfterHeader = response.headers.get("retry-after");
      const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
      if (method === "GET" && RETRYABLE.has(response.status) && attempt + 1 < maxAttempts) {
        const delay = Number.isFinite(retryAfter) ? Math.min((retryAfter as number) * 1000, 30_000) : 250 * 2 ** attempt;
        await sleep(delay);
        continue;
      }
      const message = payload?.error?.message ?? `YouTube API request failed with status ${response.status}`;
      throw new ProviderError(message, response.status, retryAfter);
    }
    throw new Error("Request exhausted retries");
  }
}
