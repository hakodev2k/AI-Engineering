import type { CodecovConfig } from './config.js';

export class CodecovError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) {
    super(message);
    this.name = 'CodecovError';
  }
}

export class CodecovClient {
  constructor(private readonly config: CodecovConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  async get(path: string, query: Record<string, string | number | boolean | undefined> = {}, signal?: AbortSignal): Promise<unknown> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query)) if (value !== undefined) url.searchParams.set(key, String(value));

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('timeout')), this.config.timeoutMs);
      const onAbort = () => controller.abort(signal?.reason);
      signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const response = await this.fetchImpl(url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${this.config.apiToken}`, Accept: 'application/json' },
          signal: controller.signal
        });
        const text = await response.text();
        const body = text ? safeJson(text) : null;
        if (response.ok) return body;
        const retryAfterMs = parseRetryAfter(response.headers.get('retry-after'));
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === this.config.maxRetries) {
          throw new CodecovError(response.status, providerMessage(body, response.status), retryAfterMs);
        }
        await sleep(retryAfterMs ?? 250 * 2 ** attempt, signal);
      } catch (error) {
        if (error instanceof CodecovError) throw error;
        if (signal?.aborted) throw signal.reason ?? new Error('cancelled');
        if (attempt === this.config.maxRetries) throw error;
        await sleep(250 * 2 ** attempt, signal);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
      }
    }
    throw new Error('unreachable');
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { raw: text.slice(0, 4096) }; }
}
function providerMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object') {
    const value = body as Record<string, unknown>;
    const msg = value.detail ?? value.message ?? value.error;
    if (typeof msg === 'string') return `Codecov ${status}: ${msg}`;
  }
  return `Codecov request failed with HTTP ${status}`;
}
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason ?? new Error('cancelled')); }, { once: true });
  });
}
