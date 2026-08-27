import type { Config } from './config.js';

export class GiteaError extends Error {
  constructor(message: string, public status?: number, public retryAfterMs?: number) { super(message); }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export class GiteaClient {
  constructor(private config: Config, private fetchFn: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; signal?: AbortSignal; retryable?: boolean } = {}): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/api/v1${path}`);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const max = options.retryable === false ? 0 : this.config.maxRetries;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('timeout')), this.config.timeoutMs);
      const onAbort = () => controller.abort(options.signal?.reason);
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        const res = await this.fetchFn(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `token ${this.config.token}`
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });
        const retryAfter = res.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.min(60000, Number(retryAfter) * 1000 || 0) : undefined;
        const text = await res.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (res.ok) return data as T;
        const message = typeof data === 'object' && data && 'message' in data ? String((data as any).message) : `Gitea HTTP ${res.status}`;
        const retryable = [429, 502, 503, 504].includes(res.status);
        if (retryable && attempt < max) {
          await sleep(retryAfterMs ?? Math.min(5000, 250 * (2 ** attempt)));
          continue;
        }
        throw new GiteaError(message, res.status, retryAfterMs);
      } catch (err) {
        if (err instanceof GiteaError) throw err;
        if (attempt < max && !options.signal?.aborted) {
          await sleep(Math.min(5000, 250 * (2 ** attempt)));
          continue;
        }
        if (options.signal?.aborted) throw new GiteaError('Request cancelled');
        throw new GiteaError(err instanceof Error ? err.message : 'Network failure');
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
      }
    }
  }

  searchRepositories(q: string, page = 1, limit = 20) { return this.request('GET', '/repos/search', { query: { q, page, limit } }); }
  listMyRepositories(page = 1, limit = 20) { return this.request('GET', '/user/repos', { query: { page, limit } }); }
  getRepository(owner: string, repo: string) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`); }
  listBranches(owner: string, repo: string, page = 1, limit = 20) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`, { query: { page, limit } }); }
  readFile(owner: string, repo: string, filePath: string, ref?: string) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`, { query: { ref } }); }
  listIssues(owner: string, repo: string, state = 'open', page = 1, limit = 20) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`, { query: { state, page, limit } }); }
  getIssue(owner: string, repo: string, index: number) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${index}`); }
  createIssue(owner: string, repo: string, title: string, body?: string) { return this.request('POST', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`, { body: { title, body }, retryable: false }); }
  createIssueComment(owner: string, repo: string, index: number, body: string) { return this.request('POST', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${index}/comments`, { body: { body }, retryable: false }); }
  listPullRequests(owner: string, repo: string, state = 'open', page = 1, limit = 20) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls`, { query: { state, page, limit } }); }
  getPullRequest(owner: string, repo: string, index: number) { return this.request('GET', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${index}`); }
  createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string) { return this.request('POST', `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls`, { body: { head, base, title, body }, retryable: false }); }
}
