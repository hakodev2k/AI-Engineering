import type { QuoConfig } from "./config.js";

export class QuoApiError extends Error {
  constructor(public status: number, public body: unknown, public retryAfterMs?: number) {
    super(`Quo API error ${status}`);
  }
}

type RequestOptions = { method?: string; query?: Record<string, string | number | boolean | string[] | undefined>; body?: unknown; retryable?: boolean };

export class QuoClient {
  constructor(private readonly config: QuoConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? "GET";
    const url = new URL(this.config.QUO_API_BASE_URL.replace(/\/$/, "") + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value === undefined) continue;
      if (Array.isArray(value)) value.forEach(v => url.searchParams.append(key, v));
      else url.searchParams.set(key, String(value));
    }

    const retryable = options.retryable ?? method === "GET";
    let lastError: unknown;
    for (let attempt = 0; attempt < (retryable ? 3 : 1); attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.QUO_REQUEST_TIMEOUT_MS);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.config.QUO_API_KEY,
            Accept: "application/json",
            ...(options.body === undefined ? {} : { "Content-Type": "application/json" })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        clearTimeout(timer);
        if (response.ok) {
          if (response.status === 204) return undefined as T;
          return await response.json() as T;
        }
        const body = await response.json().catch(() => ({ message: response.statusText }));
        const retryAfter = response.headers.get("retry-after");
        const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : undefined;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < 2) {
          await new Promise(r => setTimeout(r, retryAfterMs ?? 250 * 2 ** attempt));
          continue;
        }
        throw new QuoApiError(response.status, body, retryAfterMs);
      } catch (error) {
        clearTimeout(timer);
        lastError = error;
        if (error instanceof QuoApiError) throw error;
        if (!retryable || attempt === 2) throw error;
        await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
      }
    }
    throw lastError;
  }
}
