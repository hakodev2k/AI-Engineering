import crypto from "node:crypto";

export class ImgixError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string | null) {
    super(message); this.name = "ImgixError";
  }
}

export interface ClientOptions { token?: string; baseUrl?: string; timeoutMs?: number; maxRetries?: number; fetchImpl?: typeof fetch; }

export class ImgixClient {
  private token: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;
  private fetchImpl: typeof fetch;

  constructor(options: ClientOptions = {}) {
    this.token = options.token ?? process.env.IMGIX_API_TOKEN ?? "";
    const raw = options.baseUrl ?? process.env.IMGIX_API_BASE_URL ?? "https://api.imgix.com";
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "api.imgix.com" || (url.pathname !== "/" && url.pathname !== "")) throw new Error("IMGIX_API_BASE_URL must be https://api.imgix.com");
    this.baseUrl = "https://api.imgix.com";
    this.timeoutMs = options.timeoutMs ?? Number(process.env.IMGIX_REQUEST_TIMEOUT_MS ?? 15000);
    this.maxRetries = options.maxRetries ?? Number(process.env.IMGIX_MAX_RETRIES ?? 2);
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  private headers(): HeadersInit {
    if (!this.token) throw new Error("IMGIX_API_TOKEN is required for Management API tools");
    return { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.api+json", "Content-Type": "application/vnd.api+json" };
  }

  async request(path: string, init: RequestInit = {}, retryable = true): Promise<unknown> {
    if (!path.startsWith("/api/v1/")) throw new Error("Only scoped imgix Management API v1 paths are allowed");
    let last: unknown;
    for (let attempt = 0; attempt <= (retryable ? this.maxRetries : 0); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers: { ...this.headers(), ...(init.headers ?? {}) }, signal: controller.signal });
        const text = await response.text();
        const body = text ? safeJson(text) : null;
        if (response.ok) return body;
        const retryAfter = response.headers.get("retry-after");
        const error = new ImgixError(response.status, providerMessage(body, response.status), retryAfter);
        if (!retryable || ![429, 500, 502, 503, 504].includes(response.status) || attempt === this.maxRetries) throw error;
        await sleep(delayMs(attempt, retryAfter));
        last = error;
      } catch (error) {
        if (error instanceof ImgixError) throw error;
        last = error;
        if (!retryable || attempt === this.maxRetries) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 2000));
      } finally { clearTimeout(timer); }
    }
    throw last;
  }

  listSources(page = 1, pageSize = 20) { return this.request(`/api/v1/sources?page[number]=${page}&page[size]=${pageSize}`); }
  getSource(sourceId: string) { return this.request(`/api/v1/sources/${encodeURIComponent(sourceId)}`); }
  listAssets(sourceId: string, page = 1, pageSize = 20, query?: string) {
    const q = new URLSearchParams({ "page[number]": String(page), "page[size]": String(pageSize) });
    if (query) q.set("filter[query]", query);
    return this.request(`/api/v1/sources/${encodeURIComponent(sourceId)}/assets?${q}`);
  }
  purge(sourceId: string, url: string) {
    return this.request(`/api/v1/sources/${encodeURIComponent(sourceId)}/purge`, { method: "POST", body: JSON.stringify({ data: { type: "purges", attributes: { url } } }) }, false);
  }
}

export function buildRenderUrl(domain: string, path: string, params: Record<string, string | number | boolean>): string {
  if (!/^[a-z0-9.-]+\.imgix\.net$/i.test(domain)) throw new Error("domain must be an imgix.net render domain");
  const cleanPath = path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  if (!cleanPath) throw new Error("path is required");
  const url = new URL(`https://${domain}/${cleanPath}`);
  for (const [key, value] of Object.entries(params)) {
    if (!/^[a-z0-9-]{1,40}$/i.test(key)) throw new Error(`Invalid rendering parameter: ${key}`);
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export function signRenderUrl(unsignedUrl: string, token = process.env.IMGIX_SIGNING_TOKEN ?? ""): string {
  if (!token) throw new Error("IMGIX_SIGNING_TOKEN is required");
  const url = new URL(unsignedUrl);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".imgix.net")) throw new Error("Only HTTPS imgix.net rendering URLs can be signed");
  url.searchParams.delete("s");
  const toSign = `${url.pathname}${url.search}`;
  url.searchParams.set("s", crypto.createHash("md5").update(token + toSign).digest("hex"));
  return url.toString();
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text }; } }
function providerMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "errors" in body) return `imgix API ${status}: ${JSON.stringify((body as { errors: unknown }).errors)}`;
  return `imgix API request failed with HTTP ${status}`;
}
function delayMs(attempt: number, retryAfter: string | null): number {
  if (retryAfter && /^\d+$/.test(retryAfter)) return Math.min(Number(retryAfter) * 1000, 5000);
  return Math.min(250 * 2 ** attempt, 2000);
}
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
