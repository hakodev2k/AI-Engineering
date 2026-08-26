import { Config } from './config.js';

export class BoxError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number, public body?: unknown) {
    super(message);
  }
}

export class BoxClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  private async request(path: string, init: RequestInit = {}, upload = false): Promise<any> {
    const base = upload ? this.config.uploadBaseUrl : this.config.apiBaseUrl;
    const url = new URL(path.replace(/^\//, ''), `${base.replace(/\/$/, '')}/`);
    const method = (init.method ?? 'GET').toUpperCase();
    const retryable = ['GET', 'HEAD', 'OPTIONS'].includes(method);
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers = new Headers(init.headers);
        headers.set('Authorization', `Bearer ${this.config.token}`);
        if (init.body && !(init.body instanceof FormData) && !headers.has('content-type')) headers.set('content-type', 'application/json');
        const res = await this.fetchImpl(url, { ...init, headers, signal: controller.signal });
        const retryAfter = Number(res.headers.get('retry-after') ?? '0') || undefined;
        const text = await res.text();
        let body: unknown = undefined;
        if (text) {
          try { body = JSON.parse(text); } catch { body = text; }
        }
        if (res.ok) return body;
        const canRetry = retryable && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries;
        if (!canRetry) throw new BoxError(res.status, `Box API ${res.status}`, retryAfter, body);
        const delay = retryAfter ? retryAfter * 1000 : Math.min(250 * 2 ** attempt, 4000);
        await new Promise(r => setTimeout(r, delay));
        attempt++;
      } catch (error) {
        if (error instanceof BoxError) throw error;
        if (attempt >= this.config.maxRetries || !retryable) throw error;
        await new Promise(r => setTimeout(r, Math.min(250 * 2 ** attempt, 4000)));
        attempt++;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  search(query: string, limit = 100, offset = 0) {
    const p = new URLSearchParams({ query, limit: String(limit), offset: String(offset) });
    return this.request(`search?${p}`);
  }
  listFolder(folderId: string, limit = 100, offset = 0) {
    const p = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return this.request(`folders/${encodeURIComponent(folderId)}/items?${p}`);
  }
  getFile(fileId: string) { return this.request(`files/${encodeURIComponent(fileId)}`); }
  getFolder(folderId: string) { return this.request(`folders/${encodeURIComponent(folderId)}`); }
  createFolder(name: string, parentId: string) {
    return this.request('folders', { method: 'POST', body: JSON.stringify({ name, parent: { id: parentId } }) });
  }
  updateFile(fileId: string, patch: { name?: string; description?: string; parentId?: string }) {
    const body: Record<string, unknown> = {};
    if (patch.name !== undefined) body.name = patch.name;
    if (patch.description !== undefined) body.description = patch.description;
    if (patch.parentId !== undefined) body.parent = { id: patch.parentId };
    return this.request(`files/${encodeURIComponent(fileId)}`, { method: 'PUT', body: JSON.stringify(body) });
  }
  async uploadFile(name: string, parentId: string, contentBase64: string) {
    const data = Buffer.from(contentBase64, 'base64');
    const form = new FormData();
    form.set('attributes', JSON.stringify({ name, parent: { id: parentId } }));
    form.set('file', new Blob([data]), name);
    return this.request('files/content', { method: 'POST', body: form }, true);
  }
  listComments(fileId: string, limit = 100, offset = 0) {
    const p = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return this.request(`files/${encodeURIComponent(fileId)}/comments?${p}`);
  }
  createComment(fileId: string, message: string) {
    return this.request('comments', { method: 'POST', body: JSON.stringify({ item: { type: 'file', id: fileId }, message }) });
  }
  listWebhooks(limit = 100, marker?: string) {
    const p = new URLSearchParams({ limit: String(limit) });
    if (marker) p.set('marker', marker);
    return this.request(`webhooks?${p}`);
  }
  createWebhook(targetType: 'file' | 'folder', targetId: string, address: string, triggers: string[]) {
    return this.request('webhooks', { method: 'POST', body: JSON.stringify({ target: { type: targetType, id: targetId }, address, triggers }) });
  }
  deleteWebhook(webhookId: string) {
    return this.request(`webhooks/${encodeURIComponent(webhookId)}`, { method: 'DELETE' });
  }
}
