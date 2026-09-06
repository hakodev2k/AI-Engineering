import type { Config } from "./config.js";

export class StoryblokApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
    this.name = "StoryblokApiError";
  }
}

export class StoryblokClient {
  constructor(private c: Config, private f: typeof fetch = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | undefined>) {
    const url = new URL(this.c.baseUrl + path);
    for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k, v);
    const retryableMethod = method === "GET";
    let attempt = 0;
    while (true) {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), this.c.timeoutMs);
      try {
        const response = await this.f(url, {
          method,
          signal: ac.signal,
          headers: {
            Authorization: this.c.token,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await response.text();
        let data: unknown = text;
        if (text) { try { data = JSON.parse(text); } catch {} }
        if (response.ok) {
          return { data, meta: { total: response.headers.get("total"), perPage: response.headers.get("per-page") } };
        }
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if (retryableMethod && (response.status === 429 || response.status >= 500) && attempt < this.c.maxRetries) {
          const delay = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 2000);
          attempt++;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new StoryblokApiError(response.status, typeof data === "string" ? data : JSON.stringify(data), retryAfter);
      } catch (error) {
        if (retryableMethod && !(error instanceof StoryblokApiError) && attempt < this.c.maxRetries) {
          attempt++;
          await new Promise(r => setTimeout(r, Math.min(250 * 2 ** (attempt - 1), 2000)));
          continue;
        }
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
