import { setTimeout as sleep } from "node:timers/promises";

export class MetronomeError extends Error {
  constructor(public status: number, message: string, public retryAfterSeconds?: number) { super(message); }
}

export class MetronomeClient {
  private readonly token: string | undefined;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxReadRetries: number;
  constructor(token = process.env.METRONOME_BEARER_TOKEN) {
    this.token = token;
    this.baseUrl = (process.env.METRONOME_API_BASE_URL || "https://api.metronome.com").replace(/\/$/, "");
    if (this.baseUrl !== "https://api.metronome.com") throw new Error("Custom API base URLs are disabled to prevent credential forwarding/SSRF.");
    this.timeoutMs = Math.max(1000, Math.min(120000, Number(process.env.METRONOME_TIMEOUT_MS || 30000)));
    this.maxReadRetries = Math.max(0, Math.min(5, Number(process.env.METRONOME_MAX_READ_RETRIES || 2)));
  }

  async request<T>(method: "GET" | "POST", path: string, body?: unknown, key?: string): Promise<T> {
    if (!this.token) throw new MetronomeError(401, "METRONOME_BEARER_TOKEN is not configured.");
    const attempts = method === "GET" ? this.maxReadRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(`${this.baseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: "application/json",
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(key ? { "Idempotency-Key": key } : {})
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        let data: any = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = { message: "Non-JSON provider response" }; }
        if (res.ok) return data as T;
        const retryAfter = Number(res.headers.get("retry-after") || 0) || undefined;
        const error = new MetronomeError(res.status, String(data?.message || `Metronome HTTP ${res.status}`), retryAfter);
        const retryableRead = method === "GET" && (res.status === 429 || [500, 502, 503, 504].includes(res.status));
        if (!retryableRead || attempt === attempts - 1) throw error;
        await sleep(Math.min(10000, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (error) {
        if (error instanceof MetronomeError) throw error;
        if (method !== "GET" || attempt === attempts - 1) throw error;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
    throw new Error("Unreachable retry state.");
  }

  get<T>(path: string) { return this.request<T>("GET", path); }
  post<T>(path: string, body: unknown, key?: string) { return this.request<T>("POST", path, body, key); }
}
