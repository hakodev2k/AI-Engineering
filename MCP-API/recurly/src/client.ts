import type { Config } from "./config.js";

export class RecurlyApiError extends Error {
  constructor(public status: number, message: string, public code?: string, public retryAfter?: string) { super(message); }
}

export type FetchLike = typeof fetch;

export class RecurlyClient {
  private readonly baseUrl = "https://v3.recurly.com";
  constructor(private config: Config, private fetchImpl: FetchLike = fetch) {}

  async request(method: "GET" | "POST" | "PUT", path: string, body?: unknown, query?: Record<string, string | undefined>): Promise<unknown> {
    if (!path.startsWith("/") || path.includes("..")) throw new Error("Invalid Recurly path.");
    const url = new URL(path, this.baseUrl);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, value);
    const safeToRetry = method === "GET";
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.config.apiKey}:`).toString("base64")}`,
            Accept: `application/vnd.recurly.v${this.config.apiVersion}`,
            "Content-Type": "application/json",
            "User-Agent": "ai-engineering-recurly-mcp/1.0"
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
        if (response.ok) return parsed;
        const retryAfter = response.headers.get("retry-after") ?? undefined;
        const canRetry = safeToRetry && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
        if (canRetry) {
          const delay = retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter) * 1000, 30000) : Math.min(500 * 2 ** attempt, 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        const p = parsed as Record<string, unknown>;
        throw new RecurlyApiError(response.status, String(p.message ?? p.error ?? `Recurly HTTP ${response.status}`), typeof p.error_code === "string" ? p.error_code : undefined, retryAfter);
      } catch (error) {
        if (error instanceof RecurlyApiError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new Error(`Recurly request timed out after ${this.config.timeoutMs}ms.`);
        if (safeToRetry && attempt < this.config.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.min(500 * 2 ** attempt, 5000)));
          continue;
        }
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
