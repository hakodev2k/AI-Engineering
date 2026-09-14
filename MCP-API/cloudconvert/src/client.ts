import { setTimeout as sleep } from "node:timers/promises";

export class CloudConvertError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfter?: number) { super(message); }
}

export class CloudConvertClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  constructor(private readonly apiKey = process.env.CLOUDCONVERT_API_KEY) {
    this.baseUrl = (process.env.CLOUDCONVERT_API_BASE_URL || "https://api.cloudconvert.com/v2").replace(/\/$/, "");
    this.timeoutMs = Number(process.env.CLOUDCONVERT_TIMEOUT_MS || 30000);
    this.maxRetries = Math.min(5, Math.max(0, Number(process.env.CLOUDCONVERT_MAX_RETRIES || 2)));
  }

  available(): boolean { return Boolean(this.apiKey); }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!this.apiKey) throw new CloudConvertError(401, "MISSING_CREDENTIAL", "CLOUDCONVERT_API_KEY is not configured.");
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(`${this.baseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: { Authorization: `Bearer ${this.apiKey}`, Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
          body: body ? JSON.stringify(body) : undefined
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (res.ok) return data as T;
        const retryAfter = Number(res.headers.get("retry-after") || 0) || undefined;
        const err = new CloudConvertError(res.status, data?.code || `HTTP_${res.status}`, data?.message || res.statusText, retryAfter);
        const canRetry = res.status === 429 || ((method === "GET") && [500, 502, 503, 504].includes(res.status));
        if (!canRetry || attempt >= this.maxRetries) throw err;
        await sleep(Math.min(10000, (retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt)));
      } catch (e) {
        if (e instanceof CloudConvertError) throw e;
        const retryNetwork = method === "GET" && attempt < this.maxRetries;
        if (!retryNetwork) throw e;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
  }

  get<T>(path: string) { return this.request<T>("GET", path); }
  post<T>(path: string, body?: unknown) { return this.request<T>("POST", path, body); }
  delete<T>(path: string) { return this.request<T>("DELETE", path); }
}
