import type { Config } from './config.js';

export class NgrokApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) {
    super(message);
  }
}

export class NgrokClient {
  constructor(private readonly cfg: Config) {}

  async request<T>(method: string, path: string, body?: unknown, query?: Record<string, unknown>): Promise<T> {
    const url = new URL(path, this.cfg.apiBase + '/');
    if (url.origin !== this.cfg.apiBase) throw new Error('Refusing request outside configured ngrok API origin');
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
      }
    }

    const maxAttempts = method === 'GET' ? 3 : 1;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.cfg.apiKey}`,
            'ngrok-version': this.cfg.apiVersion,
            Accept: 'application/json',
            ...(body === undefined ? {} : {'Content-Type': 'application/json'})
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });

        if (response.status === 204) return { ok: true } as T;
        const text = await response.text();
        let payload: unknown = text;
        try { payload = text ? JSON.parse(text) : {}; } catch {}

        if (!response.ok) {
          const retryAfter = response.headers.get('retry-after') ?? undefined;
          const message = typeof payload === 'object' && payload && 'msg' in payload
            ? String((payload as {msg?: unknown}).msg)
            : `ngrok API request failed with HTTP ${response.status}`;
          const error = new NgrokApiError(response.status, message, retryAfter);
          if (method === 'GET' && (response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
            const waitMs = retryAfter ? Math.min(Number(retryAfter) * 1000, 5000) : Math.min(250 * 2 ** (attempt - 1), 2000);
            await new Promise(resolve => setTimeout(resolve, Number.isFinite(waitMs) ? waitMs : 500));
            continue;
          }
          throw error;
        }
        return payload as T;
      } catch (error) {
        lastError = error;
        if (error instanceof NgrokApiError) throw error;
        if (attempt >= maxAttempts) {
          if (error instanceof Error && error.name === 'AbortError') throw new Error('ngrok API request timed out');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('ngrok API request failed');
  }
}
