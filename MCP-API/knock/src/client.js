export class KnockApiError extends Error {
  constructor(status, message, retryAfter) { super(message); this.name = "KnockApiError"; this.status = status; this.retryAfter = retryAfter; }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export class KnockClient {
  constructor(cfg, fetchImpl = fetch) { this.cfg = cfg; this.fetchImpl = fetchImpl; }
  async request(opts) {
    const method = opts.method || "GET";
    const url = new URL(this.cfg.baseUrl + opts.path);
    for (const [k,v] of Object.entries(opts.query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const maxRetries = method === "GET" ? this.cfg.maxReadRetries : (opts.retrySafe ? Math.min(2, this.cfg.maxReadRetries) : 0);
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const headers = { Authorization:`Bearer ${this.cfg.apiKey}`, Accept:"application/json", "User-Agent":"ai-engineering-knock-mcp/1.0.0" };
        if (opts.body !== undefined) headers["Content-Type"] = "application/json";
        if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;
        const res = await this.fetchImpl(url, { method, headers, body:opts.body === undefined ? undefined : JSON.stringify(opts.body), signal:controller.signal });
        const retryAfter = res.headers.get("retry-after") || undefined;
        if (!res.ok) {
          const body = await res.text();
          if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
            const waitMs = retryAfter ? Math.min((Number(retryAfter) || 0) * 1000, 10000) : Math.min(250 * 2 ** attempt, 2000);
            await sleep(waitMs); continue;
          }
          throw new KnockApiError(res.status, body || `Knock API HTTP ${res.status}`, retryAfter);
        }
        const text = await res.text();
        return { data:text ? JSON.parse(text) : null, meta:{ retry_after:res.headers.get("retry-after"), request_id:res.headers.get("x-request-id") } };
      } catch (e) {
        if (e instanceof KnockApiError) throw e;
        if (e?.name === "AbortError") throw new Error(`Knock API request timed out after ${this.cfg.timeoutMs}ms`);
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}
