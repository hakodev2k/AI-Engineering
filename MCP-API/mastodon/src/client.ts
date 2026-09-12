import type { Config } from "./config.js";

export class MastodonError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: string) { super(message); }
}

type FetchLike = typeof fetch;

export class MastodonClient {
  constructor(private readonly config: Config, private readonly fetchFn: FetchLike = fetch) {}

  async request(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; form?: Record<string, string | number | boolean | undefined>; idempotencyKey?: string } = {}): Promise<unknown> {
    const url = new URL(path, this.config.baseUrl);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const body = options.form ? new URLSearchParams(Object.entries(options.form).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)])) : undefined;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
            ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {})
          },
          body,
          signal: controller.signal
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (res.ok) return data;
        const retryAfter = res.headers.get("retry-after") ?? res.headers.get("x-ratelimit-reset") ?? undefined;
        const retryable = res.status === 429 || res.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          const delay = res.status === 429 && retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter) * 1000, 30000) : Math.min(500 * 2 ** attempt, 5000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new MastodonError(res.status, typeof data?.error === "string" ? data.error : `Mastodon API returned ${res.status}`, retryAfter);
      } catch (e) {
        if (e instanceof MastodonError) throw e;
        if (attempt < this.config.maxRetries && method === "GET") { await new Promise(r => setTimeout(r, Math.min(500 * 2 ** attempt, 5000))); continue; }
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}
