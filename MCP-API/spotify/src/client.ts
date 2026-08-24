import type { SpotifyConfig } from './config.js';
import { SpotifyTokenProvider } from './auth.js';

export class SpotifyApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public reason?: string) { super(message); }
}

export class SpotifyClient {
  constructor(
    private readonly config: SpotifyConfig,
    private readonly tokens: SpotifyTokenProvider,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  private async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown } = {}, refreshed = false): Promise<T> {
    const url = new URL(`${this.config.apiBaseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryable = method === 'GET';
    const maxAttempts = retryable ? this.config.maxRetries + 1 : 1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const token = await this.tokens.getToken(refreshed);
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });

        if (response.status === 401 && !refreshed && this.config.refreshToken) {
          clearTimeout(timer);
          return this.request<T>(method, path, options, true);
        }

        const retryAfter = Number(response.headers.get('retry-after') ?? 0) || undefined;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt + 1 < maxAttempts) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!response.ok) {
          const text = await response.text();
          let reason: string | undefined;
          try { reason = (JSON.parse(text) as { reason?: string; error?: { reason?: string } }).reason; } catch { /* non-JSON */ }
          throw new SpotifyApiError(response.status, `Spotify API ${response.status}: ${text.slice(0, 2000)}`, retryAfter, reason);
        }
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        return (text ? JSON.parse(text) : undefined) as T;
      } catch (error) {
        if (error instanceof SpotifyApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Spotify API timeout after ${this.config.timeoutMs}ms`);
        if (!retryable || attempt + 1 >= maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw new Error('Spotify request exhausted retries');
  }

  get<T>(path: string, query?: Record<string, string | number | boolean | undefined>) { return this.request<T>('GET', path, { query }); }
  post<T>(path: string, body?: unknown) { return this.request<T>('POST', path, { body }); }
  put<T>(path: string, body?: unknown) { return this.request<T>('PUT', path, { body }); }
  delete<T>(path: string, body?: unknown) { return this.request<T>('DELETE', path, { body }); }
}
