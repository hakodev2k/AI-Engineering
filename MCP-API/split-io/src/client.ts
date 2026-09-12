import type { Config } from "./config.js";

export class SplitApiError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) {
    super(message);
  }
}

export class SplitClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private headers(): HeadersInit {
    const auth = this.config.authMode === "bearer"
      ? { Authorization: `Bearer ${this.config.apiKey}` }
      : { "x-api-key": this.config.apiKey };
    return { Accept: "application/json", "Content-Type": "application/json", ...auth };
  }

  private retryDelay(response: Response, attempt: number): number {
    const org = Number(response.headers.get("X-RateLimit-Reset-Seconds-Org") ?? "0");
    const ip = Number(response.headers.get("X-RateLimit-Reset-Seconds-IP") ?? "0");
    const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
    const headerSeconds = Math.max(org, ip, retryAfter);
    if (headerSeconds > 0) return headerSeconds * 1000;
    return Math.min(500 * 2 ** attempt, 5000);
  }

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const safePath = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.config.baseUrl}${safePath}`;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onAbort = () => controller.abort();
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: this.headers(),
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        if (response.ok) return (text ? JSON.parse(text) : undefined) as T;
        const retryable = response.status === 429 || response.status >= 500;
        const delay = this.retryDelay(response, attempt);
        if (retryable && attempt < this.config.maxRetries && method === "GET") {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new SplitApiError(response.status, text || `Split API returned ${response.status}`, delay);
      } catch (error) {
        if (error instanceof SplitApiError) throw error;
        if (controller.signal.aborted) {
          if (signal?.aborted) throw new Error("Split request cancelled");
          throw new Error(`Split request timed out after ${this.config.timeoutMs}ms`);
        }
        if (attempt < this.config.maxRetries && method === "GET") {
          await new Promise(resolve => setTimeout(resolve, Math.min(500 * 2 ** attempt, 5000)));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", onAbort);
      }
    }
    throw new Error("Split request failed after bounded retries");
  }
}
