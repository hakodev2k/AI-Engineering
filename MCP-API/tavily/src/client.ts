import { setTimeout as sleep } from "node:timers/promises";

export class TavilyHttpError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfter?: number) { super(message); }
}

export class TavilyClient {
  private readonly baseUrl = (process.env.TAVILY_API_BASE_URL || "https://api.tavily.com").replace(/\/$/, "");
  private readonly timeoutMs = Math.max(1000, Number(process.env.TAVILY_TIMEOUT_MS || 30000));
  private readonly maxRetries = Math.min(5, Math.max(0, Number(process.env.TAVILY_MAX_RETRIES || 2)));
  constructor(private readonly apiKey = process.env.TAVILY_API_KEY) {}

  async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    if (!this.apiKey) throw new TavilyHttpError(401, "MISSING_CREDENTIAL", "TAVILY_API_KEY is not configured.");
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const headers: Record<string,string> = { Authorization: `Bearer ${this.apiKey}`, Accept: "application/json" };
        if (body) headers["Content-Type"] = "application/json";
        if (process.env.TAVILY_PROJECT_ID) headers["X-Project-ID"] = process.env.TAVILY_PROJECT_ID;
        if (process.env.TAVILY_HUMAN_ID) headers["X-Human-Id"] = process.env.TAVILY_HUMAN_ID;
        const response = await fetch(`${this.baseUrl}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
        const raw = await response.text();
        let data: any = null;
        if (raw) { try { data = JSON.parse(raw); } catch { data = { message: raw.slice(0, 2000) }; } }
        if (response.ok) return data as T;
        const retryAfter = Number(response.headers.get("retry-after") || 0) || undefined;
        const err = new TavilyHttpError(response.status, data?.code || `HTTP_${response.status}`, data?.error || data?.message || response.statusText, retryAfter);
        const retryable = response.status === 429 || (method === "GET" && [500,502,503,504].includes(response.status));
        if (!retryable || attempt >= this.maxRetries) throw err;
        await sleep(Math.min(10000, retryAfter ? retryAfter * 1000 : 250 * 2 ** attempt));
      } catch (error) {
        if (error instanceof TavilyHttpError) throw error;
        if (method !== "GET" || attempt >= this.maxRetries) throw error;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
  }

  get<T>(path: string): Promise<T> { return this.request<T>("GET", path); }
  post<T>(path: string, body: unknown): Promise<T> { return this.request<T>("POST", path, body); }
}
