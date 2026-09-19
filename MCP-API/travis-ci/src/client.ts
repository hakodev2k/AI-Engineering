import type { Config } from "./config.js";

export class TravisError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class TravisClient {
  constructor(private config: Config, private fetchFn: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const mutating = method !== "GET" && method !== "HEAD";
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const abort = () => controller.abort();
      signal?.addEventListener("abort", abort, { once: true });
      try {
        const res = await this.fetchFn(`${this.config.baseUrl}${path}`, {
          method,
          headers: {
            "Authorization": `token ${this.config.token}`,
            "Travis-API-Version": "3",
            "Accept": "application/json",
            ...(body === undefined ? {} : {"Content-Type":"application/json"})
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const retryAfter = Number(res.headers.get("retry-after") || 0) || undefined;
        if (res.ok) {
          if (res.status === 204) return {} as T;
          const text = await res.text();
          return (text ? JSON.parse(text) : {}) as T;
        }
        const text = await res.text();
        const message = text.slice(0, 2000) || `Travis API error ${res.status}`;
        const retryable = res.status === 429 || res.status >= 500;
        if (!mutating && retryable && attempt < this.config.maxRetries) {
          await new Promise(r => setTimeout(r, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
          continue;
        }
        throw new TravisError(res.status, message, retryAfter);
      } catch (error) {
        if (error instanceof TravisError) throw error;
        if (!mutating && attempt < this.config.maxRetries && !signal?.aborted) {
          await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
      }
    }
  }
}

export const repoPath = (slug: string) => `/repo/${encodeURIComponent(slug)}`;
