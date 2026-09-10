import type { ConnectorConfig } from "./config.js";

export class CockroachCloudError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
    public readonly providerBody?: unknown
  ) {
    super(message);
    this.name = "CockroachCloudError";
  }
}

export type RequestOptions = {
  retryable?: boolean;
  query?: Record<string, string | number | undefined>;
};

export class CockroachCloudClient {
  constructor(
    private readonly config: ConnectorConfig,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly sleep: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  ) {}

  async request<T>(method: "GET" | "DELETE", path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith("/")) throw new Error("Provider path must be relative");
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const retryable = options.retryable ?? method === "GET";
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            Accept: "application/json"
          },
          signal: controller.signal
        });

        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        const body = await readBody(response);

        if (response.ok) return body as T;

        const error = new CockroachCloudError(
          `CockroachDB Cloud API request failed with HTTP ${response.status}`,
          response.status,
          retryAfter,
          body
        );

        if (!retryable || !isTransientStatus(response.status) || attempt === attempts - 1) throw error;
        await this.sleep(backoffMs(attempt, retryAfter));
      } catch (error) {
        lastError = error;
        if (error instanceof CockroachCloudError) {
          if (!retryable || !isTransientStatus(error.status) || attempt === attempts - 1) throw error;
          continue;
        }
        const isAbort = error instanceof Error && error.name === "AbortError";
        if (!retryable || attempt === attempts - 1) {
          throw new CockroachCloudError(isAbort ? "CockroachDB Cloud API request timed out" : "CockroachDB Cloud API network failure");
        }
        await this.sleep(backoffMs(attempt));
      } finally {
        clearTimeout(timer);
      }
    }

    throw lastError instanceof Error ? lastError : new CockroachCloudError("CockroachDB Cloud API request failed");
  }
}

function isTransientStatus(status?: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds, 30);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.min(30, Math.ceil((date - Date.now()) / 1000)));
}

function backoffMs(attempt: number, retryAfterSeconds?: number): number {
  if (retryAfterSeconds !== undefined) return retryAfterSeconds * 1000;
  return Math.min(10000, 250 * 2 ** attempt);
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return {};
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 4096) };
  }
}
