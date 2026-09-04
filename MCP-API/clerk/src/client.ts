import type { Config } from "./config.js";

export class ClerkApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) {
    super(message);
    this.name = "ClerkApiError";
  }
}

export class ClerkClient {
  constructor(private readonly cfg: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retryable?: boolean } = {}): Promise<T> {
    if (!path.startsWith("/")) throw new Error("Clerk API path must be absolute and provider-scoped.");
    const url = new URL(this.cfg.apiBaseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const canRetry = options.retryable ?? method === "GET";
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.secretKey}`,
            "Content-Type": "application/json",
            "Clerk-Version": this.cfg.apiVersion,
            "User-Agent": "ai-engineering-clerk-mcp/1.0"
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        if (response.ok) {
          if (response.status === 204) return undefined as T;
          return await response.json() as T;
        }
        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
        const raw = await response.text();
        let message = raw;
        try {
          const parsed = JSON.parse(raw) as { errors?: Array<{ message?: string; long_message?: string }> };
          message = parsed.errors?.map(e => e.long_message ?? e.message).filter(Boolean).join("; ") || raw;
        } catch {}
        const retryableStatus = response.status === 429 || response.status >= 500;
        if (canRetry && retryableStatus && attempt < this.cfg.maxRetries) {
          const waitMs = Number.isFinite(retryAfter) ? Math.max(0, retryAfter! * 1000) : Math.min(4000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, waitMs));
          attempt++;
          continue;
        }
        throw new ClerkApiError(response.status, message || `Clerk API error ${response.status}`, retryAfter);
      } catch (error) {
        if (error instanceof ClerkApiError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new Error(`Clerk API request timed out after ${this.cfg.timeoutMs}ms`);
        if (canRetry && attempt < this.cfg.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.min(4000, 250 * 2 ** attempt)));
          attempt++;
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
