import type { FireHydrantConfig } from "../auth/config.js";

export class FireHydrantError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public body?: unknown) { super(message); }
}

export class FireHydrantClient {
  constructor(private readonly config: FireHydrantConfig, private readonly fetcher: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; readOnly?: boolean } = {}): Promise<T> {
    const base = options.readOnly ? this.config.readBaseUrl : this.config.baseUrl;
    const url = new URL(`${base}${path}`);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const retryable = method === "GET";
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetcher(url, {
          method,
          headers: { Authorization: `Bearer ${this.config.apiKey}`, Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal
        });
        const text = await response.text();
        const data = text ? safeJson(text) : null;
        if (response.ok) return data as T;
        const retryAfter = Number(response.headers.get("retry-after") ?? 0) || undefined;
        const error = new FireHydrantError(response.status, `FireHydrant API ${response.status}`, retryAfter, data);
        if (!retryable || ![429, 502, 503, 504].includes(response.status) || attempt === this.config.maxRetries) throw error;
        await sleep(retryAfter ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 2000));
      } catch (error) {
        lastError = error;
        if (!retryable || error instanceof FireHydrantError || attempt === this.config.maxRetries) throw error;
        await sleep(Math.min(250 * 2 ** attempt, 2000));
      } finally { clearTimeout(timer); }
    }
    throw lastError;
  }
}

function safeJson(text: string): unknown { try { return JSON.parse(text); } catch { return { raw: text }; } }
function sleep(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
