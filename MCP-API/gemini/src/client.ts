import fs from 'node:fs/promises';
import { GeminiConfig } from './config.js';

export class GeminiApiError extends Error {
  constructor(public status: number, message: string, public retryAfterSeconds?: number) { super(message); }
}

export class GeminiClient {
  constructor(private readonly config: GeminiConfig, private readonly fetchImpl: typeof fetch = fetch) {}

  private async parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    if (Buffer.byteLength(text, 'utf8') > this.config.maxResponseBytes) throw new Error('Gemini response exceeds configured size limit');
    if (!res.ok) {
      const retryAfter = Number(res.headers.get('retry-after') ?? 0) || undefined;
      throw new GeminiApiError(res.status, `Gemini API ${res.status}: ${text.slice(0, 4000)}`, retryAfter);
    }
    return text ? JSON.parse(text) as T : undefined as T;
  }

  async request<T>(method: 'GET' | 'POST' | 'DELETE', path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.config.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) if (value !== undefined) url.searchParams.set(key, String(value));
    const retryable = method === 'GET';
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, {
          method,
          signal: controller.signal,
          headers: {
            'x-goog-api-key': this.config.apiKey,
            Accept: 'application/json',
            ...(body === undefined ? {} : { 'Content-Type': 'application/json' })
          },
          body: body === undefined ? undefined : JSON.stringify(body)
        });
        if (retryable && (res.status === 429 || res.status >= 500) && attempt < this.config.maxRetries) {
          const retryAfter = Number(res.headers.get('retry-after') ?? 0);
          await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : Math.min(8000, 250 * 2 ** attempt)));
          continue;
        }
        return await this.parseResponse<T>(res);
      } catch (error) {
        if (error instanceof GeminiApiError) throw error;
        if (error instanceof DOMException && error.name === 'AbortError') throw new Error(`Gemini API timeout after ${this.config.timeoutMs}ms`);
        if (!retryable || attempt >= this.config.maxRetries) throw error;
        await new Promise(r => setTimeout(r, Math.min(8000, 250 * 2 ** attempt)));
      } finally {
        clearTimeout(timer);
      }
    }
  }

  get<T>(path: string, query?: Record<string, string | number | undefined>) { return this.request<T>('GET', path, undefined, query); }
  post<T>(path: string, body: unknown) { return this.request<T>('POST', path, body); }
  delete<T>(path: string) { return this.request<T>('DELETE', path); }

  async uploadFile(filePath: string, mimeType: string, displayName?: string): Promise<unknown> {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error('Upload target must be a regular file');
    if (stat.size > 2 * 1024 * 1024 * 1024) throw new Error('Gemini Files API maximum file size is 2 GB');
    const start = await this.fetchImpl(`${this.config.uploadBaseUrl}/files`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': this.config.apiKey,
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(stat.size),
        'X-Goog-Upload-Header-Content-Type': mimeType,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file: displayName ? { display_name: displayName } : {} })
    });
    if (!start.ok) throw new GeminiApiError(start.status, `Gemini upload start failed: ${(await start.text()).slice(0, 4000)}`);
    const uploadUrl = start.headers.get('x-goog-upload-url');
    if (!uploadUrl?.startsWith('https://generativelanguage.googleapis.com/')) throw new Error('Gemini did not return a trusted upload URL');
    const bytes = await fs.readFile(filePath);
    const finish = await this.fetchImpl(uploadUrl, {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Offset': '0',
        'X-Goog-Upload-Command': 'upload, finalize',
        'Content-Length': String(bytes.length)
      },
      body: bytes
    });
    return this.parseResponse<unknown>(finish);
  }
}
