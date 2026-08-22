import type { Config } from './config.js';

export class AssemblyAiApiError extends Error {
  constructor(public readonly status: number, public readonly details: unknown, message: string) { super(message); }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  accept?: string;
  base?: 'api' | 'llm';
};

export class AssemblyAiClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = options.method ?? 'GET';
    const origin = options.base === 'llm' ? this.config.llmBaseUrl : this.config.apiBaseUrl;
    const url = new URL(origin + path);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const maxAttempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            authorization: this.config.apiKey,
            Accept: options.accept ?? 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'ai-engineering-assemblyai-mcp/1.0'
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const text = await response.text();
        const contentType = response.headers.get('content-type') ?? '';
        let data: unknown = text;
        if (contentType.includes('application/json') && text) {
          try { data = JSON.parse(text); } catch { data = { raw: text }; }
        }
        if (response.ok) return data as T;

        if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
          const retryAfter = Number(response.headers.get('retry-after') ?? 0);
          const waitMs = retryAfter > 0 ? Math.min(retryAfter * 1000, 10000) : 250 * 2 ** (attempt - 1);
          await new Promise(resolve => setTimeout(resolve, waitMs));
          continue;
        }
        throw new AssemblyAiApiError(response.status, data, `AssemblyAI ${method} ${path} failed with HTTP ${response.status}`);
      } catch (error) {
        lastError = error;
        if (error instanceof AssemblyAiApiError) throw error;
        if (attempt === maxAttempts) throw new Error(`NETWORK_OR_TIMEOUT: ${error instanceof Error ? error.message : String(error)}`);
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }
}
