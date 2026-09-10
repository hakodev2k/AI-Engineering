import type { Config } from "./config.js";

export class TinybirdError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
    public readonly responseBody?: unknown
  ) {
    super(message);
    this.name = "TinybirdError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  query?: Record<string, string | number | boolean | undefined>;
  body?: string;
  contentType?: string;
  retryable?: boolean;
};

export class TinybirdClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? "GET";
    const url = new URL(path, `${this.config.apiHost}/`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const attempts = options.retryable === false || method !== "GET" ? 1 : this.config.maxRetries;
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            Accept: "application/json",
            ...(options.contentType ? { "Content-Type": options.contentType } : {})
          },
          body: options.body,
          signal: controller.signal
        });
        const text = await response.text();
        const parsed = text ? safeJson(text) : {};
        if (response.ok) return parsed as T;

        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        const retryableStatus = [429, 502, 503, 504].includes(response.status);
        const error = new TinybirdError(`Tinybird API request failed with HTTP ${response.status}`, response.status, retryAfter, parsed);
        if (!retryableStatus || attempt === attempts) throw error;
        await sleep(Math.min((retryAfter ?? 2 ** (attempt - 1)) * 1000, 10_000));
      } catch (error) {
        lastError = error;
        if (error instanceof TinybirdError) {
          if (attempt === attempts) throw error;
        } else if (error instanceof Error && error.name === "AbortError") {
          throw new TinybirdError("Tinybird API request timed out");
        } else if (attempt === attempts) {
          throw new TinybirdError("Tinybird API network failure", undefined, undefined, String(error));
        }
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new TinybirdError("Tinybird request failed");
  }

  listJobs(filters: Record<string, string | undefined>) {
    return this.request("v0/jobs", { query: filters });
  }

  getJob(id: string) {
    return this.request(`v0/jobs/${encodeURIComponent(id)}`);
  }

  callEndpoint(name: string, params: Record<string, string | number | boolean>) {
    return this.request(`v0/pipes/${encodeURIComponent(name)}.json`, { query: params });
  }

  ingestEvents(name: string, events: Record<string, unknown>[], wait: boolean) {
    const body = events.map(event => JSON.stringify(event)).join("\n");
    return this.request("v0/events", {
      method: "POST",
      query: { name, wait },
      body,
      contentType: "application/x-ndjson",
      retryable: false
    });
  }
}

function safeJson(value: string): unknown {
  try { return JSON.parse(value); } catch { return { raw: value }; }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : undefined;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
