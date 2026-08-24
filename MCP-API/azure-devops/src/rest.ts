import { AzureDevOpsConfig } from './config.js';

export class AzureDevOpsHttpError extends Error {
  constructor(public readonly status: number, message: string, public readonly retryAfterSeconds?: number) { super(message); }
}

export class AzureDevOpsRestClient {
  constructor(private readonly config: AzureDevOpsConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private authHeader() {
    if (this.config.authMode === 'entra') return `Bearer ${this.config.bearerToken}`;
    return `Basic ${Buffer.from(`${this.config.patEmail}:${this.config.pat}`).toString('base64')}`;
  }

  private base() {
    return `https://dev.azure.com/${encodeURIComponent(this.config.organization)}`;
  }

  async request<T>(method: string, path: string, options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; contentType?: string; accept?: string } = {}): Promise<T> {
    const url = new URL(`${this.base()}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const canRetry = method === 'GET' || method === 'HEAD';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const response = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: this.authHeader(),
            Accept: options.accept ?? 'application/json',
            ...(options.body === undefined ? {} : { 'Content-Type': options.contentType ?? 'application/json' })
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body)
        });
        const retryAfter = Number(response.headers.get('retry-after') ?? '0');
        if (canRetry && (response.status === 429 || response.status >= 500) && attempt < this.config.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (!response.ok) {
          const text = await response.text();
          throw new AzureDevOpsHttpError(response.status, `Azure DevOps REST ${response.status}: ${text.slice(0, 2000)}`, retryAfter || undefined);
        }
        if (response.status === 204) return undefined as T;
        if ((options.accept ?? '').startsWith('text/')) return await response.text() as T;
        return await response.json() as T;
      } catch (error) {
        if (error instanceof AzureDevOpsHttpError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Azure DevOps request timed out after ${this.config.timeoutMs}ms`);
        if (!canRetry || attempt >= this.config.maxRetries) throw error;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  listProjects(top = 50) {
    return this.request('GET', '/_apis/projects', { query: { '$top': top, 'api-version': '7.1' } });
  }

  listRepositories(project: string, top = 100) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/git/repositories`, { query: { '$top': top, 'api-version': '7.1' } });
  }

  readFile(project: string, repository: string, path: string, branch: string) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repository)}/items`, {
      query: { path, includeContent: true, 'versionDescriptor.version': branch, 'versionDescriptor.versionType': 'branch', 'api-version': '7.1' }
    });
  }

  listPullRequests(project: string, repository: string, status = 'active', top = 50) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repository)}/pullrequests`, {
      query: { 'searchCriteria.status': status, '$top': top, 'api-version': '7.1' }
    });
  }

  getPullRequest(project: string, repository: string, id: number) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repository)}/pullrequests/${id}`, { query: { 'api-version': '7.1' } });
  }

  createPullRequest(project: string, repository: string, input: { title: string; description?: string; sourceRefName: string; targetRefName: string; isDraft?: boolean }) {
    return this.request('POST', `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repository)}/pullrequests`, { query: { 'api-version': '7.1' }, body: input });
  }

  getWorkItem(project: string, id: number) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/wit/workitems/${id}`, { query: { '$expand': 'Relations', 'api-version': '7.1' } });
  }

  createWorkItem(project: string, type: string, fields: { title: string; description?: string; assignedTo?: string; tags?: string }) {
    const patch: Array<{ op: 'add'; path: string; value: string }> = [{ op: 'add', path: '/fields/System.Title', value: fields.title }];
    if (fields.description) patch.push({ op: 'add', path: '/fields/System.Description', value: fields.description });
    if (fields.assignedTo) patch.push({ op: 'add', path: '/fields/System.AssignedTo', value: fields.assignedTo });
    if (fields.tags) patch.push({ op: 'add', path: '/fields/System.Tags', value: fields.tags });
    return this.request('POST', `/${encodeURIComponent(project)}/_apis/wit/workitems/$${encodeURIComponent(type)}`, { query: { 'api-version': '7.1' }, body: patch, contentType: 'application/json-patch+json' });
  }

  addWorkItemComment(project: string, id: number, text: string) {
    return this.request('POST', `/${encodeURIComponent(project)}/_apis/wit/workItems/${id}/comments`, { query: { 'api-version': '7.1-preview.4' }, body: { text } });
  }

  listBuilds(project: string, top = 50) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/build/builds`, { query: { '$top': top, 'api-version': '7.1' } });
  }

  getBuild(project: string, id: number) {
    return this.request('GET', `/${encodeURIComponent(project)}/_apis/build/builds/${id}`, { query: { 'api-version': '7.1' } });
  }

  runPipeline(project: string, pipelineId: number, branch?: string, templateParameters?: Record<string, string>) {
    const body: Record<string, unknown> = {};
    if (branch) body.resources = { repositories: { self: { refName: branch.startsWith('refs/') ? branch : `refs/heads/${branch}` } } };
    if (templateParameters) body.templateParameters = templateParameters;
    return this.request('POST', `/${encodeURIComponent(project)}/_apis/pipelines/${pipelineId}/runs`, { query: { 'api-version': '7.1' }, body });
  }
}
