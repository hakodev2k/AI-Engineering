import type { Config } from './config.js';

export class AssemblyAIError extends Error {
  constructor(public status: number, public details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  accept?: string;
};

export class AssemblyAIClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const url = new URL(this.config.baseUrl + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const maxAttempts = method === 'GET' ? 3 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            authorization: this.config.apiKey,
            accept: options.accept ?? 'application/json',
            'content-type': 'application/json',
            'user-agent': 'ai-engineering-assemblyai-mcp/1.0'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });

        const text = await response.text();
        let data: unknown = text;
        if ((response.headers.get('content-type') ?? '').includes('json') && text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (response.ok) return data as T;

        if (response.status === 429 && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 1);
          await new Promise(resolve => setTimeout(resolve, Math.min(Math.max(retryAfter, 0), 10) * 1000));
          continue;
        }
        if (response.status >= 500 && attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
          continue;
        }
        throw new AssemblyAIError(response.status, data, `AssemblyAI API ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        if (error instanceof AssemblyAIError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('UNREACHABLE');
  }
}
