import type { Config } from './config.js';

export class DeepgramApiError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  rawBody?: Uint8Array;
  contentType?: string;
  retryable?: boolean;
};

export class DeepgramClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const maxAttempts = (options.retryable ?? method === 'GET') ? 3 : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers: Record<string, string> = {
          Authorization: `Token ${this.config.apiKey}`,
          Accept: 'application/json',
          'User-Agent': 'ai-engineering-deepgram-mcp/1.0'
        };
        let body: BodyInit | undefined;
        if (options.rawBody) {
          headers['Content-Type'] = options.contentType ?? 'application/octet-stream';
          body = options.rawBody as unknown as BodyInit;
        } else if (options.body !== undefined) {
          headers['Content-Type'] = options.contentType ?? 'application/json';
          body = JSON.stringify(options.body);
        }

        const response = await this.fetchImpl(url, { method, headers, body, signal: controller.signal });
        const text = await response.text();
        let data: unknown = {};
        if (text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (response.ok) return data as T;

        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 1);
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }
        throw new DeepgramApiError(response.status, data, `Deepgram API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        if (error instanceof DeepgramApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('UNREACHABLE');
  }
}
