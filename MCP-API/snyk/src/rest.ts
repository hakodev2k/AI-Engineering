import type { Config } from './config.js';

export class SnykApiError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number, public errorReference?: string) {
    super(message);
  }
}

export class SnykRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const url = new URL(`${this.config.SNYK_REST_BASE_URL.replace(/\/$/, '')}${path}`);
    if (!url.searchParams.has('version')) url.searchParams.set('version', this.config.SNYK_API_VERSION);
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.SNYK_MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.SNYK_TIMEOUT_MS);
      try {
        const response = await this.fetchImpl(url, {
          ...options,
          signal: controller.signal,
          headers: {
            Accept: 'application/vnd.api+json, application/json',
            Authorization: `token ${this.config.SNYK_TOKEN}`,
            ...(options.body ? { 'Content-Type': 'application/vnd.api+json' } : {}),
            ...(options.headers ?? {})
          }
        });
        const text = await response.text();
        if (response.ok) return text ? JSON.parse(text) : null;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        const message = safeErrorMessage(text) || `Snyk API returned HTTP ${response.status}`;
        const err = new SnykApiError(response.status, message, retryAfterMs, response.headers.get('x-error-reference') ?? undefined);
        if (!shouldRetry(response.status) || attempt === this.config.SNYK_MAX_RETRIES) throw err;
        await sleep(retryAfterMs ?? Math.min(5000, 250 * 2 ** attempt));
      } catch (error) {
        lastError = error;
        if (error instanceof SnykApiError) throw error;
        if (attempt === this.config.SNYK_MAX_RETRIES) throw error;
        await sleep(Math.min(5000, 250 * 2 ** attempt));
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Snyk request failed');
  }

  listOrgs(limit = 20, cursor?: string) {
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor) q.set('starting_after', cursor);
    return this.request(`/orgs?${q}`);
  }

  listProjects(orgId: string, limit = 20, cursor?: string, targetReference?: string) {
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor) q.set('starting_after', cursor);
    if (targetReference) q.set('target_reference', targetReference);
    return this.request(`/orgs/${encodeURIComponent(orgId)}/projects?${q}`);
  }

  getProject(orgId: string, projectId: string, withCounts = true) {
    const q = new URLSearchParams();
    if (withCounts) {
      q.set('meta.latest_issue_counts', 'true');
      q.set('meta.latest_dependency_total', 'true');
    }
    return this.request(`/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}?${q}`);
  }

  listIssues(orgId: string, limit = 20, cursor?: string) {
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor) q.set('starting_after', cursor);
    return this.request(`/orgs/${encodeURIComponent(orgId)}/issues?${q}`);
  }

  getIssue(orgId: string, issueId: string) {
    return this.request(`/orgs/${encodeURIComponent(orgId)}/issues/${encodeURIComponent(issueId)}`);
  }

  getProjectSbom(orgId: string, projectId: string, format: string) {
    const q = new URLSearchParams({ format });
    return this.request(`/orgs/${encodeURIComponent(orgId)}/projects/${encodeURIComponent(projectId)}/sbom?${q}`);
  }
}

function shouldRetry(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
function safeErrorMessage(text: string): string | undefined {
  try {
    const parsed = JSON.parse(text);
    return parsed?.errors?.[0]?.detail ?? parsed?.message ?? parsed?.error;
  } catch { return text.slice(0, 500) || undefined; }
}
