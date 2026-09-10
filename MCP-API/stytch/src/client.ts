import type { Config } from './config.js';

export class StytchApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterMs?: number
  ) { super(message); }
}

export class StytchClient {
  private readonly auth: string;
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {
    this.auth = `Basic ${Buffer.from(`${config.projectId}:${config.secret}`).toString('base64')}`;
  }

  async request<T>(method: 'GET'|'POST'|'PUT', path: string, body?: unknown, retryable = method === 'GET'): Promise<T> {
    if (!path.startsWith('/v1/b2b/')) throw new Error('Only scoped Stytch B2B API paths are allowed');
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(`${this.config.baseUrl}${path}`, {
          method,
          headers: {
            Authorization: this.auth,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await response.text();
        let data: unknown = text;
        try { data = text ? JSON.parse(text) : {}; } catch {}
        if (response.ok) return data as T;
        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        const message = typeof data === 'object' && data && 'error_message' in data
          ? String((data as {error_message?: unknown}).error_message)
          : `Stytch API returned HTTP ${response.status}`;
        const error = new StytchApiError(message.slice(0, 1000), response.status, retryAfter);
        if (!retryable || !isTransient(response.status) || attempt === attempts - 1) throw error;
        await sleep(retryAfter ?? Math.min(250 * 2 ** attempt, 4000));
      } catch (error) {
        last = error;
        const transientNetwork = error instanceof TypeError || (error instanceof Error && error.name === 'AbortError');
        if (!retryable || !transientNetwork || attempt === attempts - 1) {
          if (error instanceof StytchApiError) throw error;
          if (error instanceof Error && error.name === 'AbortError') throw new StytchApiError('Stytch request timed out');
          throw error;
        }
        await sleep(Math.min(250 * 2 ** attempt, 4000));
      } finally { clearTimeout(timer); }
    }
    throw last instanceof Error ? last : new Error('Stytch request failed');
  }
}

function isTransient(status: number): boolean { return status === 429 || status === 502 || status === 503 || status === 504; }
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
