export class BrowserlessError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export type ClientOptions = { token: string; baseUrl?: string; timeoutMs?: number; fetchImpl?: typeof fetch };

export class BrowserlessClient {
  private token: string;
  private baseUrl: string;
  private timeoutMs: number;
  private fetchImpl: typeof fetch;

  constructor(o: ClientOptions) {
    if (!o.token) throw new Error('BROWSERLESS_TOKEN is required');
    this.token = o.token;
    this.baseUrl = (o.baseUrl ?? 'https://production-sfo.browserless.io').replace(/\/$/, '');
    if (!/^https:\/\//.test(this.baseUrl)) throw new Error('BROWSERLESS_BASE_URL must use HTTPS');
    this.timeoutMs = o.timeoutMs ?? 30000;
    this.fetchImpl = o.fetchImpl ?? fetch;
  }

  async post(path: string, body: unknown, binary = false): Promise<unknown> {
    const url = new URL(this.baseUrl + path);
    url.searchParams.set('token', this.token);
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await this.fetchImpl(url, { method: 'POST', headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }, body: JSON.stringify(body), signal: controller.signal });
        if (res.ok) {
          if (binary) return { contentType: res.headers.get('content-type') ?? 'application/octet-stream', base64: Buffer.from(await res.arrayBuffer()).toString('base64') };
          const text = await res.text();
          try { return JSON.parse(text); } catch { return text; }
        }
        const retryAfter = Number(res.headers.get('retry-after') ?? 0);
        if ((res.status === 429 || res.status >= 500) && attempt < 2) {
          await new Promise(r => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
          continue;
        }
        throw new BrowserlessError(res.status, `Browserless request failed (${res.status}): ${(await res.text()).slice(0, 1000)}`, retryAfter || undefined);
      } catch (e) {
        if (e instanceof BrowserlessError) throw e;
        if (attempt === 2) throw e;
        await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
      } finally { clearTimeout(timer); }
    }
    throw new Error('Browserless request exhausted retries');
  }
}
