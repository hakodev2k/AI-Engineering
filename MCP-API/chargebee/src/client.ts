import type { Config } from "./config.js";
export class ChargebeeApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string, public body?: unknown) { super(message); }
}
export class ChargebeeClient {
  constructor(private config: Config, private fetcher: typeof fetch = fetch) {}
  async request(method: string, path: string, params?: Record<string, unknown>) {
    const url = new URL(`https://${this.config.site}.chargebee.com/api/v2${path}`);
    const body = new URLSearchParams();
    for (const [k,v] of Object.entries(params ?? {})) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) v.forEach(x => body.append(k, String(x))); else body.append(k, String(v));
    }
    if (method === "GET") for (const [k,v] of body) url.searchParams.append(k,v);
    const auth = Buffer.from(`${this.config.apiKey}:`).toString("base64");
    for (let attempt=0; attempt<=this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetcher(url, { method, headers:{ Authorization:`Basic ${auth}`, Accept:"application/json", ...(method === "GET" ? {} : {"Content-Type":"application/x-www-form-urlencoded"}) }, body: method === "GET" ? undefined : body, signal:controller.signal });
        const text = await response.text();
        let data: unknown = text; try { data = text ? JSON.parse(text) : {}; } catch {}
        if (response.ok) return data;
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        if ((response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const wait = retryAfter ? Math.min(Number(retryAfter) * 1000 || 0, 30000) : Math.min(500 * 2 ** attempt, 8000);
          await new Promise(r => setTimeout(r, wait)); continue;
        }
        const msg = typeof data === "object" && data && "message" in data ? String((data as any).message) : `Chargebee API error ${response.status}`;
        throw new ChargebeeApiError(response.status, msg, retryAfter, data);
      } catch (error) {
        if (error instanceof ChargebeeApiError) throw error;
        if ((error as Error).name === "AbortError") throw new Error("Chargebee request timed out.");
        if (attempt >= this.config.maxRetries) throw error;
        await new Promise(r => setTimeout(r, Math.min(500 * 2 ** attempt, 8000)));
      } finally { clearTimeout(timer); }
    }
    throw new Error("Chargebee request failed after bounded retries.");
  }
}
