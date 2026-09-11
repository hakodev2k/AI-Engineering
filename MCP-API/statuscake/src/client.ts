import type { StatusCakeConfig } from "./config.js";

export class StatusCakeError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
    public readonly details?: unknown
  ) { super(message); }
}

export type FetchLike = typeof fetch;

type Method = "GET" | "POST" | "PUT" | "DELETE";

export class StatusCakeClient {
  constructor(private readonly config: StatusCakeConfig, private readonly fetchImpl: FetchLike = fetch) {}

  async request(path: string, options: { method?: Method; query?: Record<string, unknown>; form?: Record<string, unknown> } = {}): Promise<unknown> {
    const method = options.method ?? "GET";
    const url = new URL(`${this.config.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined || value === null || value === false) continue;
      url.searchParams.set(key, String(value));
    }

    const body = options.form ? encodeForm(options.form) : undefined;
    const maxAttempts = method === "GET" ? this.config.maxRetries + 1 : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {})
          },
          body,
          signal: controller.signal
        });

        const reset = parsePositiveInt(response.headers.get("x-ratelimit-reset"));
        const retryable = response.status === 429 || response.status >= 500;
        if (!response.ok) {
          const details = await parseBody(response);
          if (retryable && attempt < maxAttempts) {
            await delay(Math.min(10_000, Math.max(250, (reset ?? 2 ** (attempt - 1)) * 1000)));
            continue;
          }
          throw new StatusCakeError(`StatusCake API request failed with HTTP ${response.status}`, response.status, reset, details);
        }

        if (response.status === 204) return { ok: true };
        return await parseBody(response);
      } catch (error) {
        if (error instanceof StatusCakeError) throw error;
        const isAbort = error instanceof Error && error.name === "AbortError";
        if (attempt < maxAttempts) {
          await delay(Math.min(10_000, 250 * 2 ** (attempt - 1)));
          continue;
        }
        throw new StatusCakeError(isAbort ? "StatusCake API request timed out" : "StatusCake API network request failed", undefined, undefined, error);
      } finally {
        clearTimeout(timer);
      }
    }
    throw new StatusCakeError("StatusCake API request failed after retries");
  }
}

function encodeForm(input: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(`${key}[]`, String(item));
    } else if (typeof value === "object") {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  }
  return params;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return { ok: true };
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

function parsePositiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
