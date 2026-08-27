import type { Config } from './config.js';

export class MattermostError extends Error {
  constructor(public status: number, message: string, public retryAfterMs?: number) { super(message); }
}

export class MattermostRestClient {
  constructor(private readonly config: Config, private readonly fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const url = new URL(`/api/v4${path}`, this.config.serverUrl);
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const merged = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: merged
        });
        if (response.ok) {
          if (response.status === 204) return undefined as T;
          return await response.json() as T;
        }
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter ? Math.max(0, Number(retryAfter) * 1000) : undefined;
        const text = await response.text();
        const retryable = response.status === 429 || response.status >= 500;
        if (retryable && attempt < this.config.maxRetries) {
          const delay = retryAfterMs ?? Math.min(4000, 250 * 2 ** attempt) + Math.floor(Math.random() * 100);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new MattermostError(response.status, text || `Mattermost HTTP ${response.status}`, retryAfterMs);
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  me(signal?: AbortSignal) { return this.request<any>('GET', '/users/me', undefined, signal); }
  teams(signal?: AbortSignal) { return this.request<any[]>('GET', '/users/me/teams', undefined, signal); }
  channels(teamId: string, signal?: AbortSignal) { return this.request<any[]>('GET', `/users/me/teams/${encodeURIComponent(teamId)}/channels`, undefined, signal); }
  channel(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/channels/${encodeURIComponent(id)}`, undefined, signal); }
  searchChannels(teamId: string, term: string, signal?: AbortSignal) { return this.request<any[]>('POST', `/teams/${encodeURIComponent(teamId)}/channels/search`, { term }, signal); }
  post(id: string, signal?: AbortSignal) { return this.request<any>('GET', `/posts/${encodeURIComponent(id)}`, undefined, signal); }
  searchPosts(teamId: string, terms: string, signal?: AbortSignal) { return this.request<any>('POST', `/teams/${encodeURIComponent(teamId)}/posts/search`, { terms, is_or_search: false }, signal); }
  createPost(channelId: string, message: string, rootId?: string, signal?: AbortSignal) { return this.request<any>('POST', '/posts', { channel_id: channelId, message, ...(rootId ? { root_id: rootId } : {}) }, signal); }
  updatePost(postId: string, message: string, signal?: AbortSignal) { return this.request<any>('PUT', `/posts/${encodeURIComponent(postId)}/patch`, { message }, signal); }
  deletePost(postId: string, signal?: AbortSignal) { return this.request<void>('DELETE', `/posts/${encodeURIComponent(postId)}`, undefined, signal); }
  reactions(postId: string, signal?: AbortSignal) { return this.request<any[]>('GET', `/posts/${encodeURIComponent(postId)}/reactions`, undefined, signal); }
  async addReaction(postId: string, emojiName: string, signal?: AbortSignal) { const me = await this.me(signal); return this.request<any>('POST', '/reactions', { user_id: me.id, post_id: postId, emoji_name: emojiName }, signal); }
  async removeReaction(postId: string, emojiName: string, signal?: AbortSignal) { const me = await this.me(signal); return this.request<void>('DELETE', `/users/${encodeURIComponent(me.id)}/posts/${encodeURIComponent(postId)}/reactions/${encodeURIComponent(emojiName)}`, undefined, signal); }
}
