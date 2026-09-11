import type { ConnectorConfig } from "./config.js";

export class OpenObserveHttpError extends Error {
  constructor(public readonly status: number, public readonly body: unknown, message?: string) {
    super(message ?? `OpenObserve HTTP ${status}`);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class OpenObserveRestClient {
  constructor(private readonly config: ConnectorConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request(method: "GET" | "POST", path: string, body?: unknown): Promise<unknown> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.config.baseUrl}${path}`, {
          method,
          headers: {
            Authorization: this.config.authHeader,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let parsed: unknown = text;
        if (text) {
          try { parsed = JSON.parse(text); } catch { /* keep text */ }
        }
        if (response.ok) return parsed;
        const retryable = response.status === 429 || response.status === 502 || response.status === 503 || response.status === 504;
        if (!retryable || attempt === this.config.maxRetries) throw new OpenObserveHttpError(response.status, parsed);
        const retryAfter = response.headers.get("retry-after");
        const waitMs = retryAfter && /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.min(250 * 2 ** attempt, 4000);
        await sleep(waitMs);
      } catch (error) {
        lastError = error;
        if (error instanceof OpenObserveHttpError) throw error;
        if (attempt === this.config.maxRetries) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 4000));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error("OpenObserve request failed");
  }

  get(path: string): Promise<unknown> { return this.request("GET", path); }
  post(path: string, body: unknown): Promise<unknown> { return this.request("POST", path, body); }

  orgPath(suffix: string): string {
    return `/api/${encodeURIComponent(this.config.orgId)}${suffix}`;
  }
}

export function queryString(values: Record<string, string | number | boolean | undefined>): string {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value !== undefined) p.set(key, String(value));
  return p.toString();
}
