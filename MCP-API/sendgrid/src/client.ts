import type { SendGridConfig } from './config.js';

export class SendGridError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public details?: unknown) {
    super(message);
  }
}

export class SendGridClient {
  constructor(private readonly config: SendGridConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, retryable = true): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        const parsed = text ? safeJson(text) : undefined;
        if (res.ok) return parsed as T;

        const retryAfter = parseRetryAfter(res.headers);
        const transient = retryable && [408, 429, 500, 502, 503, 504].includes(res.status);
        if (transient && attempt < this.config.maxRetries) {
          const waitMs = retryAfter != null ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 5000);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }
        throw new SendGridError(res.status, extractMessage(parsed) ?? `SendGrid HTTP ${res.status}`, retryAfter, parsed);
      } catch (error) {
        if (error instanceof SendGridError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new SendGridError(408, 'SendGrid request timed out');
        if (attempt < this.config.maxRetries && retryable) {
          await new Promise((resolve) => setTimeout(resolve, Math.min(500 * 2 ** attempt, 5000)));
          continue;
        }
        throw new SendGridError(0, error instanceof Error ? error.message : 'Network failure');
      } finally {
        clearTimeout(timer);
      }
    }
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

function extractMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Record<string, unknown>;
  if (typeof v.message === 'string') return v.message;
  if (Array.isArray(v.errors) && v.errors[0] && typeof v.errors[0] === 'object') {
    const m = (v.errors[0] as Record<string, unknown>).message;
    if (typeof m === 'string') return m;
  }
  return undefined;
}

function parseRetryAfter(headers: Headers): number | undefined {
  const direct = headers.get('retry-after');
  if (direct && /^\d+$/.test(direct)) return Number(direct);
  const reset = headers.get('x-ratelimit-reset');
  if (reset && /^\d+$/.test(reset)) return Math.max(0, Number(reset) - Math.floor(Date.now() / 1000));
  return undefined;
}
