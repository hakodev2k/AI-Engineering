import type { WebflowConfig } from "./config.js";

export class WebflowApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfter?: number,
    public readonly code?: string
  ) { super(message); }
}

export type FetchLike = typeof fetch;

export class WebflowClient {
  constructor(private readonly config: WebflowConfig, private readonly fetchFn: FetchLike = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const retryableMethod = method === "GET";
    let attempt = 0;
    for (;;) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchFn(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            Accept: "application/json",
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (response.ok) {
          if (response.status === 204) return { ok: true };
          return await response.json();
        }

        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        let payload: any = undefined;
        try { payload = await response.json(); } catch { /* provider may return non-JSON */ }
        const message = payload?.message ?? payload?.msg ?? `Webflow API request failed with HTTP ${response.status}.`;
        const error = new WebflowApiError(response.status, message, retryAfter, payload?.code);
        const retryableStatus = response.status === 429 || response.status >= 500;
        if (retryableMethod && retryableStatus && attempt < this.config.maxRetries) {
          const delay = retryAfter !== undefined ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 4000);
          attempt += 1;
          await sleep(delay);
          continue;
        }
        throw error;
      } catch (error) {
        clearTimeout(timer);
        if (error instanceof WebflowApiError) throw error;
        if (error instanceof Error && error.name === "AbortError") throw new Error(`Webflow request timed out after ${this.config.timeoutMs} ms.`);
        if (retryableMethod && attempt < this.config.maxRetries) {
          attempt += 1;
          await sleep(Math.min(500 * 2 ** (attempt - 1), 4000));
          continue;
        }
        throw error;
      }
    }
  }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
