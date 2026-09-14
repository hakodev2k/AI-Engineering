import { setTimeout as sleep } from "node:timers/promises";

export class NeonApiError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfter?: number) { super(message); }
}

export class NeonClient {
  private readonly baseUrl = (process.env.NEON_API_BASE_URL || "https://console.neon.tech/api/v2").replace(/\/$/, "");
  private readonly timeoutMs = Number(process.env.NEON_TIMEOUT_MS || 30000);
  private readonly maxRetries = Math.min(5, Math.max(0, Number(process.env.NEON_MAX_RETRIES || 2)));
  constructor(private readonly apiKey = process.env.NEON_API_KEY) {}

  available(): boolean { return Boolean(this.apiKey); }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!this.apiKey) throw new NeonApiError(401, "MISSING_CREDENTIAL", "NEON_API_KEY is not configured.");
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(`${this.baseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: "application/json",
            ...(body !== undefined ? { "Content-Type": "application/json" } : {})
          },
          body: body !== undefined ? JSON.stringify(body) : undefined
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (res.ok) return data as T;
        const retryAfter = Number(res.headers.get("retry-after") || 0) || undefined;
        const err = new NeonApiError(res.status, data?.code || `HTTP_${res.status}`, data?.message || res.statusText, retryAfter);
        const retryable = res.status === 503 || res.status === 423 || (method === "GET" && (res.status === 429 || res.status >= 500));
        if (!retryable || attempt >= this.maxRetries) throw err;
        await sleep(Math.min(10000, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (error) {
        if (error instanceof NeonApiError) throw error;
        if (method !== "GET" || attempt >= this.maxRetries) throw error;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string) { return this.request<T>("GET", path); }
  post<T>(path: string, body?: unknown) { return this.request<T>("POST", path, body); }
  delete<T>(path: string) { return this.request<T>("DELETE", path); }
}
