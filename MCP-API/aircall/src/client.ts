import type { Config } from "./config.js";

export class AircallError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) {
    super(message);
    this.name = "AircallError";
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class AircallClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader(): string {
    if (this.config.auth.type === "bearer") return `Bearer ${this.config.auth.accessToken}`;
    return `Basic ${Buffer.from(`${this.config.auth.apiId}:${this.config.auth.apiToken}`).toString("base64")}`;
  }

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; retrySafe?: boolean } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.authHeader(),
            Accept: "application/json",
            ...(options.body !== undefined ? { "Content-Type": "application/json" } : {})
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });

        if (res.ok) {
          if (res.status === 204) return undefined as T;
          return await res.json() as T;
        }

        const text = await res.text();
        const retryAfterHeader = res.headers.get("retry-after");
        const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
        const retryable = options.retrySafe !== false && (res.status === 429 || res.status >= 500);
        if (retryable && attempt < this.config.maxRetries) {
          const waitMs = Number.isFinite(retryAfter) ? retryAfter! * 1000 : Math.min(1000 * 2 ** attempt, 8000);
          await sleep(waitMs);
          continue;
        }
        throw new AircallError(res.status, `Aircall API ${res.status}: ${text.slice(0, 1000)}`, retryAfter);
      } catch (error) {
        if (error instanceof AircallError) throw error;
        if (error instanceof DOMException && error.name === "AbortError") throw new Error(`Aircall request timed out after ${this.config.timeoutMs}ms`);
        if (attempt < this.config.maxRetries && options.retrySafe !== false) {
          await sleep(Math.min(1000 * 2 ** attempt, 8000));
          continue;
        }
        throw error;
      } finally {
        clearTimeout(timer);
      }
    }
  }
}
