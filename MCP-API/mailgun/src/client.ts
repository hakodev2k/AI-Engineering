import { config } from './config.js';

export class MailgunError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

type RequestOptions = { method?: string; query?: Record<string, string | number | undefined>; form?: Record<string, string | number | string[] | undefined>; retryable?: boolean };

export class MailgunClient {
  private readonly baseUrl: string;
  constructor(private readonly fetchImpl: typeof fetch = fetch) {
    if (!config.apiKey) throw new Error('MAILGUN_API_KEY is required.');
    this.baseUrl = config.region === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
  }

  async request(path: string, options: RequestOptions = {}): Promise<any> {
    const method = options.method ?? 'GET';
    const url = new URL(path, this.baseUrl);
    for (const [k, v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
    const headers: Record<string,string> = { Authorization: `Basic ${Buffer.from(`api:${config.apiKey}`).toString('base64')}` };
    let body: BodyInit | undefined;
    if (options.form) {
      const form = new FormData();
      for (const [k, v] of Object.entries(options.form)) {
        if (v === undefined) continue;
        if (Array.isArray(v)) for (const item of v) form.append(k, item); else form.append(k, String(v));
      }
      body = form;
    }
    const max = options.retryable === false || !['GET','HEAD'].includes(method) ? 0 : config.maxRetries;
    for (let attempt = 0; ; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const res = await this.fetchImpl(url, { method, headers, body, signal: controller.signal });
        const text = await res.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return { message: text }; } })() : {};
        if (res.ok) return data;
        const retryAfter = Number(res.headers.get('retry-after') ?? 0) || undefined;
        if ((res.status === 429 || res.status >= 500) && attempt < max) {
          const delay = retryAfter ? retryAfter * 1000 : Math.min(1000 * 2 ** attempt, 5000);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new MailgunError(res.status, data?.message ?? `Mailgun API error ${res.status}`, retryAfter);
      } catch (err: any) {
        if (err?.name === 'AbortError') throw new Error(`Mailgun request timed out after ${config.timeoutMs}ms`);
        throw err;
      } finally { clearTimeout(timer); }
    }
  }
}
