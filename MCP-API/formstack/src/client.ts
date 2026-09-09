import type { Config } from './config.js';

type QueryValue = string | number | boolean | undefined | null;

export class FormstackError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
  }
}

export class FormstackClient {
  constructor(private readonly cfg: Config) {}

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    query?: Record<string, QueryValue>
  ): Promise<T> {
    const url = new URL(`${this.cfg.apiBase}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    }

    const attempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.accessToken}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });

        const retryAfter = Number(response.headers.get('retry-after') ?? '0') || undefined;
        const text = await response.text();
        const parsed = text ? safeJson(text) : null;

        if (response.ok) return parsed as T;

        const message = providerMessage(parsed) ?? `Formstack API request failed with HTTP ${response.status}`;
        const error = new FormstackError(message, response.status, retryAfter);
        if (method === 'GET' && (response.status === 429 || response.status === 503) && attempt + 1 < attempts) {
          const waitMs = Math.min((retryAfter ?? 2 ** attempt) * 1000, 10000);
          await sleep(waitMs);
          continue;
        }
        throw error;
      } catch (error) {
        lastError = error;
        if (error instanceof FormstackError) throw error;
        if (error instanceof Error && error.name === 'AbortError') throw new FormstackError('Formstack request timed out');
        if (attempt + 1 >= attempts) throw new FormstackError('Formstack network request failed');
        await sleep(Math.min(2 ** attempt * 500, 2000));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new FormstackError('Formstack request failed');
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text.slice(0, 4000) }; }
}

function providerMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  for (const key of ['message', 'error', 'detail']) {
    const candidate = (value as Record<string, unknown>)[key];
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
