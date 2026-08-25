import type { Config } from './config.js';

export class MailchimpError extends Error {
  constructor(public status: number, message: string, public detail?: unknown, public retryAfterSeconds?: number) {
    super(message);
    this.name = 'MailchimpError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MailchimpClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeaders(): Record<string, string> {
    if (this.config.oauthToken) return { Authorization: `Bearer ${this.config.oauthToken}` };
    const basic = Buffer.from(`connector:${this.config.apiKey ?? ''}`).toString('base64');
    return { Authorization: `Basic ${basic}` };
  }

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const retryableMethod = method === 'GET';
    let attempt = 0;
    while (true) {
      const timeout = AbortSignal.timeout(this.config.timeoutMs);
      const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
      let response: Response;
      try {
        response = await this.fetchImpl(url, {
          method,
          headers: {
            ...this.authHeaders(),
            Accept: 'application/json',
            ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {})
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal
        });
      } catch (error) {
        if (retryableMethod && attempt < this.config.maxRetries && !(error instanceof DOMException && error.name === 'AbortError')) {
          await sleep(Math.min(250 * 2 ** attempt, 2000));
          attempt += 1;
          continue;
        }
        throw error;
      }

      if (response.ok) {
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        return (text ? JSON.parse(text) : undefined) as T;
      }

      const retryAfterRaw = response.headers.get('retry-after');
      const retryAfterSeconds = retryAfterRaw && /^\d+$/.test(retryAfterRaw) ? Number(retryAfterRaw) : undefined;
      const text = await response.text();
      let detail: unknown = text;
      try { detail = text ? JSON.parse(text) : undefined; } catch { /* preserve text */ }

      const canRetry = retryableMethod && attempt < this.config.maxRetries && (response.status === 429 || response.status >= 500);
      if (canRetry) {
        const delayMs = retryAfterSeconds !== undefined ? retryAfterSeconds * 1000 : Math.min(250 * 2 ** attempt, 2000);
        await sleep(delayMs);
        attempt += 1;
        continue;
      }

      const message = typeof detail === 'object' && detail && 'detail' in detail
        ? String((detail as Record<string, unknown>).detail)
        : `Mailchimp API request failed with HTTP ${response.status}`;
      throw new MailchimpError(response.status, message, detail, retryAfterSeconds);
    }
  }
}
