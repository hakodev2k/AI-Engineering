import type { Config } from "./config.js";

export class AppwriteApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); this.name = "AppwriteApiError"; }
}

export class AppwriteRestClient {
  constructor(private c: Config, private f: typeof fetch = fetch) {}
  available() { return Boolean(this.c.endpoint && this.c.projectId && this.c.apiKey); }

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | string[] | undefined>) {
    if (!this.available()) throw new Error("Appwrite REST fallback is not configured.");
    const url = new URL(this.c.endpoint + path);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v === undefined) continue;
      if (Array.isArray(v)) for (const item of v) url.searchParams.append(k, item);
      else url.searchParams.set(k, v);
    }
    const safe = method === "GET";
    let attempt = 0;
    while (true) {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), this.c.timeoutMs);
      try {
        const r = await this.f(url, {
          method,
          signal: ac.signal,
          headers: {
            "X-Appwrite-Project": this.c.projectId,
            "X-Appwrite-Key": this.c.apiKey,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await r.text();
        let data: unknown = text;
        if (text) try { data = JSON.parse(text); } catch {}
        if (r.ok) return { data, meta: { rateLimitLimit: r.headers.get("x-ratelimit-limit"), rateLimitRemaining: r.headers.get("x-ratelimit-remaining"), rateLimitReset: r.headers.get("x-ratelimit-reset") } };
        const retryAfter = r.headers.get("retry-after") ?? undefined;
        if (safe && (r.status === 429 || r.status >= 500) && attempt < this.c.maxRetries) {
          const delay = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 2000);
          attempt++; await new Promise(resolve => setTimeout(resolve, delay)); continue;
        }
        throw new AppwriteApiError(r.status, typeof data === "string" ? data : JSON.stringify(data), retryAfter);
      } catch (error) {
        if (safe && !(error instanceof AppwriteApiError) && attempt < this.c.maxRetries) {
          attempt++; await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** (attempt - 1), 2000))); continue;
        }
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
