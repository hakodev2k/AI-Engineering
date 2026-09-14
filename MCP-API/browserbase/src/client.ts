import type { Config } from './config.js';

export class BrowserbaseApiError extends Error {
  constructor(public status: number, public retryAfter?: number, message = `Browserbase API error ${status}`) { super(message); }
}

export class BrowserbaseClient {
  constructor(private readonly config: Config) {}

  async request(path: string, options: { method?: 'GET' | 'POST'; body?: unknown; query?: Record<string, string | number | boolean | undefined>; retryable?: boolean } = {}): Promise<unknown> {
    const method = options.method ?? 'GET';
    const url = new URL(path, this.config.apiBaseUrl);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const attempts = (options.retryable ?? method === 'GET') ? 3 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'X-BB-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal,
          redirect: 'error'
        });
        const text = await response.text();
        const data = text ? safeJson(text) : null;
        if (response.ok) return data;
        const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
        const error = new BrowserbaseApiError(response.status, retryAfter, sanitizedMessage(data, response.status));
        if (attempt + 1 < attempts && (response.status === 429 || response.status >= 500)) {
          await sleep(Math.min((retryAfter ?? 2 ** attempt) * 1000, 8000));
          continue;
        }
        throw error;
      } catch (error) {
        if (error instanceof BrowserbaseApiError) throw error;
        if (attempt + 1 >= attempts) {
          if ((error as Error).name === 'AbortError') throw new Error(`TIMEOUT: Browserbase request exceeded ${this.config.timeoutMs}ms`);
          throw new Error(`NETWORK_ERROR: ${(error as Error).message}`);
        }
        await sleep(Math.min(2 ** attempt * 500, 4000));
      } finally { clearTimeout(timer); }
    }
    throw new Error('NETWORK_ERROR: request attempts exhausted');
  }
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text); } catch { return { message: text.slice(0, 500) }; }
}
function sanitizedMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'message' in data && typeof (data as { message?: unknown }).message === 'string') return `Browserbase ${status}: ${(data as { message: string }).message.slice(0, 300)}`;
  return `Browserbase API error ${status}`;
}
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const when = Date.parse(value);
  return Number.isNaN(when) ? undefined : Math.max(0, Math.ceil((when - Date.now()) / 1000));
}
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
