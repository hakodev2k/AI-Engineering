import { setTimeout as sleep } from "node:timers/promises";

export class ScrapingBeeHttpError extends Error {
  constructor(public status: number, public retryAfterSeconds: number | undefined, message: string) { super(message); }
}
export type ApiResult = { status:number; contentType:string; encoding:"utf8"|"base64"; body:string };

export class ScrapingBeeClient {
  private readonly baseUrl = (process.env.SCRAPINGBEE_API_BASE_URL || "https://app.scrapingbee.com/api/v1").replace(/\/$/, "");
  private readonly timeoutMs = Math.max(1000, Number(process.env.SCRAPINGBEE_TIMEOUT_MS || 30000));
  private readonly maxRetries = Math.min(5, Math.max(0, Number(process.env.SCRAPINGBEE_MAX_RETRIES || 2)));
  private readonly maxBytes = Math.min(5_000_000, Math.max(1024, Number(process.env.SCRAPINGBEE_MAX_RESPONSE_BYTES || 2_000_000)));
  constructor(private readonly apiKey = process.env.SCRAPINGBEE_API_KEY) {}
  available(): boolean { return Boolean(this.apiKey); }

  async get(path: string, params: Record<string, string | number | boolean | undefined>): Promise<ApiResult> {
    if (!this.apiKey) throw new ScrapingBeeHttpError(401, undefined, "SCRAPINGBEE_API_KEY is not configured.");
    const u = new URL(this.baseUrl + path);
    for (const [k,v] of Object.entries(params)) if (v !== undefined) u.searchParams.set(k, String(v));
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(u, { signal: controller.signal, headers: { Authorization: `Bearer ${this.apiKey}`, Accept: "*/*" } });
        const retryAfterSeconds = Number(res.headers.get("retry-after") || 0) || undefined;
        const len = Number(res.headers.get("content-length") || 0);
        if (len > this.maxBytes) throw new ScrapingBeeHttpError(413, undefined, `Provider response exceeds ${this.maxBytes} byte connector limit.`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength > this.maxBytes) throw new ScrapingBeeHttpError(413, undefined, `Provider response exceeds ${this.maxBytes} byte connector limit.`);
        const contentType = res.headers.get("content-type") || "application/octet-stream";
        if (res.ok) {
          const textual = /^(text\/|application\/(json|xml|javascript|xhtml\+xml))/i.test(contentType);
          return { status:res.status, contentType, encoding:textual ? "utf8" : "base64", body:textual ? buf.toString("utf8") : buf.toString("base64") };
        }
        const err = new ScrapingBeeHttpError(res.status, retryAfterSeconds, buf.toString("utf8").slice(0,2000) || res.statusText);
        const retryable = res.status === 429 || [500,502,503,504].includes(res.status);
        if (!retryable || attempt >= this.maxRetries) throw err;
        await sleep(Math.min(10_000, retryAfterSeconds ? retryAfterSeconds * 1000 : 250 * 2 ** attempt));
      } catch (e) {
        if (e instanceof ScrapingBeeHttpError) throw e;
        if (attempt >= this.maxRetries) throw e;
        await sleep(Math.min(5_000, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
  }
}
