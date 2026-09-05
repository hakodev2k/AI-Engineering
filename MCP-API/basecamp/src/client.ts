import type { Config } from "./config.js";

export class BasecampApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string, public reason?: string) {
    super(message);
    this.name = "BasecampApiError";
  }
}

function parseNext(link: string | null): string | undefined {
  if (!link) return undefined;
  const match = link.match(/<([^>]+)>;\s*rel="next"/);
  return match?.[1];
}

export class BasecampClient {
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | undefined>) {
    const url = new URL(path.startsWith("http") ? path : this.config.baseUrl + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, v);
    if (url.origin !== "https://3.basecampapi.com") throw new Error("Refusing non-Basecamp API URL.");
    return this.call(method, url.toString(), body);
  }

  private async call(method: string, url: string, body?: unknown) {
    const retryable = method === "GET";
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            Accept: "application/json",
            "User-Agent": this.config.userAgent,
            ...(body === undefined ? {} : { "Content-Type": "application/json; charset=utf-8" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let data: unknown = text;
        if (text) { try { data = JSON.parse(text); } catch {} }
        if (response.ok) {
          return {
            data: response.status === 204 ? null : data,
            meta: {
              next: parseNext(response.headers.get("link")),
              totalCount: response.headers.get("x-total-count") ? Number(response.headers.get("x-total-count")) : undefined,
              etag: response.headers.get("etag") ?? undefined,
              lastModified: response.headers.get("last-modified") ?? undefined
            }
          };
        }
        if (retryable && (response.status === 429 || [500, 502, 503, 504].includes(response.status)) && attempt < this.config.maxRetries) {
          const ra = response.headers.get("retry-after");
          const delay = ra && /^\d+$/.test(ra) ? Number(ra) * 1000 : Math.min(250 * 2 ** attempt, 2000);
          attempt++;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new BasecampApiError(
          response.status,
          typeof data === "string" ? data : JSON.stringify(data),
          response.headers.get("retry-after") ?? undefined,
          response.headers.get("reason") ?? undefined
        );
      } catch (error) {
        if (retryable && !(error instanceof BasecampApiError) && attempt < this.config.maxRetries) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** (attempt - 1), 2000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
