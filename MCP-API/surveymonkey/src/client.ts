import type { Config } from "./config.js";

export class SurveyMonkeyApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string, public requestId?: string) {
    super(message);
  }
}

export class SurveyMonkeyClient {
  constructor(private config: Config, private fetchImpl: typeof fetch = fetch) {}

  async request(method: string, path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>) {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));

    const retryable = method === "GET" || method === "HEAD";
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.config.accessToken}`,
            ...(body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timeout);
        const text = await response.text();
        const payload = text ? safeJson(text) : null;
        if (response.ok) {
          return {
            data: payload,
            meta: {
              status: response.status,
              rateLimitRemaining: response.headers.get("x-ratelimit-app-global-minute-remaining") ?? response.headers.get("x-ratelimit-app-global-day-remaining"),
              rateLimitReset: response.headers.get("x-ratelimit-app-global-minute-reset") ?? response.headers.get("x-ratelimit-app-global-day-reset"),
              source: "untrusted_provider_data"
            }
          };
        }

        const retryAfter = response.headers.get("retry-after") ?? undefined;
        const requestId = response.headers.get("x-request-id") ?? undefined;
        const message = extractMessage(payload) || `SurveyMonkey API request failed with HTTP ${response.status}.`;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          await delay(backoff(attempt, retryAfter));
          continue;
        }
        throw new SurveyMonkeyApiError(response.status, message, retryAfter, requestId);
      } catch (error) {
        clearTimeout(timeout);
        lastError = error;
        if (error instanceof SurveyMonkeyApiError) throw error;
        if (!retryable || attempt >= this.config.maxRetries) throw error;
        await delay(backoff(attempt));
      }
    }
    throw lastError instanceof Error ? lastError : new Error("SurveyMonkey request failed.");
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text }; } }
function extractMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  if (typeof v.error === "object" && v.error && typeof (v.error as Record<string, unknown>).message === "string") return (v.error as Record<string, unknown>).message as string;
  return typeof v.message === "string" ? v.message : undefined;
}
function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
function backoff(attempt: number, retryAfter?: string) {
  const seconds = retryAfter ? Number(retryAfter) : NaN;
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 30000);
  return Math.min(500 * 2 ** attempt, 8000);
}
