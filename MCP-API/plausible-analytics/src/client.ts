import type { PlausibleConfig } from "./config.js";

export class PlausibleError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) { super(message); }
}

export class PlausibleClient {
  constructor(private readonly config: PlausibleConfig, private readonly fetchFn: typeof fetch = fetch) {}

  async query(body: unknown): Promise<unknown> {
    return this.request("/api/v2/query", { method: "POST", auth: true, body });
  }

  async sendEvent(body: unknown, userAgent: string, forwardedFor?: string): Promise<unknown> {
    const headers: Record<string,string> = { "User-Agent": userAgent };
    if (forwardedFor) headers["X-Forwarded-For"] = forwardedFor;
    return this.request("/api/event", { method: "POST", auth: false, body, headers, retryable: false });
  }

  private async request(path: string, opts: { method: string; auth: boolean; body?: unknown; headers?: Record<string,string>; retryable?: boolean }): Promise<unknown> {
    let last: unknown;
    const retries = opts.retryable === false ? 0 : this.config.maxRetries;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers: Record<string,string> = { "Content-Type": "application/json", ...(opts.headers ?? {}) };
        if (opts.auth) headers.Authorization = `Bearer ${this.config.statsApiKey}`;
        const res = await this.fetchFn(`${this.config.baseUrl}${path}`, {
          method: opts.method,
          headers,
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
          signal: controller.signal
        });
        const text = await res.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return { raw: text }; } })() : {};
        if (res.ok) return { data, status: res.status, dropped: res.headers.get("x-plausible-dropped") === "1" };
        const retryAfter = Number(res.headers.get("retry-after") ?? "0") || undefined;
        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || attempt === retries) throw new PlausibleError(`Plausible API error ${res.status}`, res.status, retryAfter);
        await new Promise(r => setTimeout(r, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (e) {
        last = e;
        if (e instanceof PlausibleError) throw e;
        if (attempt === retries) throw new PlausibleError(e instanceof Error ? e.message : String(e));
        await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
    throw last;
  }
}
