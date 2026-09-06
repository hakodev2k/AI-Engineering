import type { PaddleConfig } from "./config.js";

export interface PaddleErrorBody {
  error?: { type?: string; code?: string; detail?: string; documentation_url?: string; errors?: unknown[] };
  meta?: { request_id?: string };
}

export class PaddleApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
    public readonly retryAfter?: number
  ) { super(message); }
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  skipCount?: boolean;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta?: { request_id?: string; pagination?: { per_page?: number; next?: string; has_more?: boolean; estimated_total?: number } };
}

export interface AggregatedPage<T = unknown> {
  data: T[];
  pages: number;
  hasMore: boolean;
  next?: string;
  requestIds: string[];
}

type FetchLike = typeof fetch;
type Sleep = (ms: number) => Promise<void>;
const defaultSleep: Sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function retryAfterSeconds(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const date = Date.parse(raw);
  if (Number.isFinite(date)) return Math.max(0, Math.ceil((date - Date.now()) / 1000));
  return undefined;
}

export class PaddleClient {
  constructor(
    private readonly config: PaddleConfig,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly sleep: Sleep = defaultSleep
  ) {}

  async request<T>(method: "GET" | "POST" | "PATCH", path: string, options: RequestOptions = {}): Promise<T> {
    if (!path.startsWith("/") || path.includes("://") || path.includes("\\")) throw new Error("Paddle path must be a relative API path.");
    const url = new URL(path, this.config.baseUrl);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const retryable = method === "GET";
    let lastError: unknown;
    for (let attempt = 0; attempt <= (retryable ? this.config.maxRetries : 0); attempt++) {
      const timeout = new AbortController();
      const timer = setTimeout(() => timeout.abort(new Error("Paddle API request timed out.")), this.config.timeoutMs);
      const signal = options.signal ? AbortSignal.any([options.signal, timeout.signal]) : timeout.signal;
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal,
          headers: {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Accept": "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
            ...(options.skipCount ? { "Skip-Count": "true" } : {})
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const parsed = text ? JSON.parse(text) : {};
        if (response.ok) return parsed as T;

        const body = parsed as PaddleErrorBody;
        const retryAfter = retryAfterSeconds(response.headers.get("retry-after"));
        const error = new PaddleApiError(
          body.error?.detail || `Paddle API returned HTTP ${response.status}.`,
          response.status,
          body.error?.code,
          body.meta?.request_id,
          retryAfter
        );
        if (retryable && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500)) {
          const delay = retryAfter !== undefined ? Math.min(retryAfter * 1000, 60000) : Math.min(250 * 2 ** attempt, 4000);
          await this.sleep(delay);
          lastError = error;
          continue;
        }
        throw error;
      } catch (error) {
        if (error instanceof PaddleApiError) throw error;
        if (signal.aborted) throw new PaddleApiError("Paddle API request timed out or was cancelled.", 408);
        lastError = error;
        if (!retryable || attempt >= this.config.maxRetries) throw error;
        await this.sleep(Math.min(250 * 2 ** attempt, 4000));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error("Paddle API request failed.");
  }

  async list<T>(path: string, query: Record<string, string | number | boolean | undefined>, maxPages: number, skipCount = true): Promise<AggregatedPage<T>> {
    const first = await this.request<PaginatedResponse<T>>("GET", path, { query, skipCount });
    const data = [...(first.data ?? [])];
    const requestIds = first.meta?.request_id ? [first.meta.request_id] : [];
    let pagination = first.meta?.pagination;
    let pages = 1;
    let next = pagination?.next;

    while (pagination?.has_more && next && pages < maxPages) {
      const nextUrl = new URL(next);
      const allowedHost = new URL(this.config.baseUrl).host;
      if (nextUrl.protocol !== "https:" || nextUrl.host !== allowedHost) throw new Error("Paddle pagination returned an unexpected host.");
      const page = await this.request<PaginatedResponse<T>>("GET", `${nextUrl.pathname}${nextUrl.search}`, { skipCount });
      data.push(...(page.data ?? []));
      if (page.meta?.request_id) requestIds.push(page.meta.request_id);
      pagination = page.meta?.pagination;
      next = pagination?.next;
      pages++;
    }
    return { data, pages, hasMore: Boolean(pagination?.has_more), next, requestIds };
  }
}
