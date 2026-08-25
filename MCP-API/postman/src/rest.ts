import type { Config } from './config.js';

export class PostmanApiError extends Error {
  constructor(public status: number, message: string, public retryAfterSeconds?: number) {
    super(message);
  }
}

export class PostmanRestClient {
  constructor(private readonly config: Config) {}

  private async request<T>(method: string, path: string, body?: unknown, retryable = false): Promise<T> {
    const attempts = retryable ? this.config.maxRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await fetch(`${this.config.apiBaseUrl}${path}`, {
          method,
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (res.ok) return data as T;

        const retryAfter = Number(res.headers.get('retry-after') ?? res.headers.get('x-ratelimit-retryafter') ?? '0') || undefined;
        const message = data?.error?.message ?? data?.message ?? `Postman API ${res.status}`;
        const mayRetry = retryable && (res.status === 429 || res.status >= 500) && attempt + 1 < attempts;
        if (!mayRetry) throw new PostmanApiError(res.status, message, retryAfter);
        const waitMs = retryAfter ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 4000);
        await new Promise(resolve => setTimeout(resolve, waitMs));
      } catch (error) {
        if (error instanceof PostmanApiError) throw error;
        if (attempt + 1 >= attempts) {
          if ((error as Error).name === 'AbortError') throw new Error(`Postman API timeout after ${this.config.timeoutMs}ms`);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, Math.min(250 * 2 ** attempt, 4000)));
      } finally {
        clearTimeout(timeout);
      }
    }
    throw new Error('Postman API request failed');
  }

  listWorkspaces() { return this.request<any>('GET', '/workspaces', undefined, true); }
  getWorkspace(id: string) { return this.request<any>('GET', `/workspaces/${encodeURIComponent(id)}`, undefined, true); }
  createWorkspace(workspace: unknown) { return this.request<any>('POST', '/workspaces', { workspace }); }
  updateWorkspace(id: string, workspace: unknown) { return this.request<any>('PUT', `/workspaces/${encodeURIComponent(id)}`, { workspace }); }

  listCollections(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${encodeURIComponent(workspaceId)}` : '';
    return this.request<any>('GET', `/collections${q}`, undefined, true);
  }
  getCollection(id: string) { return this.request<any>('GET', `/collections/${encodeURIComponent(id)}`, undefined, true); }
  createCollection(collection: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${encodeURIComponent(workspaceId)}` : '';
    return this.request<any>('POST', `/collections${q}`, { collection });
  }
  replaceCollection(id: string, collection: unknown) { return this.request<any>('PUT', `/collections/${encodeURIComponent(id)}`, { collection }); }

  listEnvironments(workspaceId?: string) {
    const q = workspaceId ? `?workspace=${encodeURIComponent(workspaceId)}` : '';
    return this.request<any>('GET', `/environments${q}`, undefined, true);
  }
  getEnvironment(id: string) { return this.request<any>('GET', `/environments/${encodeURIComponent(id)}`, undefined, true); }
  createEnvironment(environment: unknown, workspaceId?: string) {
    const q = workspaceId ? `?workspace=${encodeURIComponent(workspaceId)}` : '';
    return this.request<any>('POST', `/environments${q}`, { environment });
  }
  replaceEnvironment(id: string, environment: unknown) { return this.request<any>('PUT', `/environments/${encodeURIComponent(id)}`, { environment }); }
}
