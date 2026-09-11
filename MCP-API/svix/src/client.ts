import type { Config } from "./config.js";

export class SvixApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds?: number,
    public readonly body?: unknown,
  ) {
    super(message);
  }
}

export class SvixClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async sleep(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const retryableMethod = method === "GET" || method === "HEAD";
    const maxAttempts = retryableMethod ? 3 : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
        });

        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfterSeconds = retryAfterHeader && /^\d+$/.test(retryAfterHeader) ? Number(retryAfterHeader) : undefined;
        const text = await response.text();
        let payload: unknown = undefined;
        if (text) {
          try { payload = JSON.parse(text); } catch { payload = text; }
        }

        if (response.ok) return payload as T;

        const retryableStatus = response.status === 429 || response.status >= 500;
        if (attempt < maxAttempts && retryableStatus) {
          const delay = retryAfterSeconds !== undefined ? retryAfterSeconds * 1000 : Math.min(250 * 2 ** (attempt - 1), 2000);
          await this.sleep(delay);
          continue;
        }

        throw new SvixApiError(`Svix API request failed with HTTP ${response.status}`, response.status, retryAfterSeconds, payload);
      } catch (error) {
        if (error instanceof SvixApiError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new Error("SVIX_TIMEOUT");
        if (attempt < maxAttempts) {
          await this.sleep(Math.min(250 * 2 ** (attempt - 1), 2000));
          continue;
        }
        throw new Error(`SVIX_NETWORK_ERROR:${error instanceof Error ? error.message : "unknown"}`);
      } finally {
        clearTimeout(timer);
      }
    }

    throw new Error("SVIX_UNREACHABLE");
  }
}
