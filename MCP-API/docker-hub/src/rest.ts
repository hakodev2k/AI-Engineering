import { DockerHubConfig, requireCredentials } from './config.js';

export class DockerHubError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfter?: number) { super(message); }
}

export class DockerHubRestClient {
  private jwt?: string;
  private jwtCreatedAt = 0;

  constructor(private readonly config: DockerHubConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async token(force = false): Promise<string | undefined> {
    if (!this.config.username || !this.config.pat) return undefined;
    if (!force && this.jwt && Date.now() - this.jwtCreatedAt < 5 * 60_000) return this.jwt;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const res = await this.fetchImpl(`${this.config.apiBaseUrl}/auth/token`, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ identifier: this.config.username, secret: this.config.pat })
      });
      if (!res.ok) throw new DockerHubError(res.status, `Docker Hub authentication failed (${res.status})`);
      const data = await res.json() as { access_token?: string; token?: string };
      const token = data.access_token ?? data.token;
      if (!token) throw new Error('Docker Hub authentication response did not contain a token');
      this.jwt = token;
      this.jwtCreatedAt = Date.now();
      return token;
    } finally {
      clearTimeout(timer);
    }
  }

  async request<T>(method: string, path: string, options: { body?: unknown; query?: Record<string, string | number | boolean | undefined>; auth?: boolean; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const needsAuth = options.auth ?? false;
    if (needsAuth) requireCredentials(this.config);

    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.token(attempt > 0);
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        const canRetry = options.retryable !== false && (res.status === 429 || res.status >= 500);
        if (canRetry && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new DockerHubError(res.status, `Docker Hub API ${res.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (res.status === 204) return undefined as T;
        return await res.json() as T;
      } catch (error) {
        if (error instanceof DockerHubError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Docker Hub API timeout after ${this.config.timeoutMs}ms`);
        if (options.retryable === false || attempt >= this.config.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>, auth = false) { return this.request<T>('GET', path, { query, auth }); }
  post<T>(path: string, body: unknown, auth = true) { return this.request<T>('POST', path, { body, auth, retryable: false }); }
  patch<T>(path: string, body: unknown, auth = true) { return this.request<T>('PATCH', path, { body, auth, retryable: false }); }
}
