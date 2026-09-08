type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

type RequestOptions = { method?: HttpMethod; query?: Record<string,string|number|boolean|undefined>; body?: unknown; retryable?: boolean };

export class BrevoError extends Error {
  constructor(public status: number, public code: string|undefined, message: string, public retryAfter?: number) { super(message); }
}

const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));

export class BrevoClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(opts: { apiKey?: string; baseUrl?: string; timeoutMs?: number; maxRetries?: number } = {}) {
    this.apiKey = opts.apiKey ?? process.env.BREVO_API_KEY ?? '';
    if (!this.apiKey) throw new Error('BREVO_API_KEY is required.');
    this.baseUrl = (opts.baseUrl ?? process.env.BREVO_API_BASE_URL ?? 'https://api.brevo.com/v3').replace(/\/$/,'');
    if (this.baseUrl !== 'https://api.brevo.com/v3') throw new Error('BREVO_API_BASE_URL must be https://api.brevo.com/v3 to prevent SSRF.');
    this.timeoutMs = opts.timeoutMs ?? Number(process.env.BREVO_TIMEOUT_MS ?? 15000);
    this.maxRetries = Math.min(opts.maxRetries ?? Number(process.env.BREVO_MAX_RETRIES ?? 2), 5);
  }

  async request<T>(path:string, options:RequestOptions = {}):Promise<T> {
    if (!path.startsWith('/')) throw new Error('API path must be absolute and provider-relative.');
    const url = new URL(this.baseUrl + path);
    for (const [k,v] of Object.entries(options.query ?? {})) if (v !== undefined) url.searchParams.set(k,String(v));
    const method = options.method ?? 'GET';
    const retryable = options.retryable ?? method === 'GET';
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await fetch(url, {
          method,
          headers: {'api-key':this.apiKey,'accept':'application/json', ...(options.body === undefined ? {} : {'content-type':'application/json'})},
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal,
        });
        const text = await response.text();
        const data:any = text ? JSON.parse(text) : null;
        if (response.ok) return data as T;
        const retryAfter = Number(response.headers.get('retry-after') ?? response.headers.get('x-sib-ratelimit-reset') ?? 0);
        const code = data?.code;
        const message = data?.message ?? `Brevo API HTTP ${response.status}`;
        if (retryable && (response.status === 429 || response.status >= 500) && attempt < this.maxRetries) {
          const delay = retryAfter > 0 ? retryAfter * 1000 : Math.min(250 * 2 ** attempt + Math.floor(Math.random()*100), 4000);
          attempt++; await sleep(delay); continue;
        }
        throw new BrevoError(response.status, code, message, retryAfter || undefined);
      } catch (error:any) {
        if (error instanceof BrevoError) throw error;
        if (retryable && attempt < this.maxRetries && (error?.name === 'AbortError' || error instanceof TypeError)) {
          attempt++; await sleep(Math.min(250 * 2 ** (attempt-1), 4000)); continue;
        }
        if (error?.name === 'AbortError') throw new Error(`Brevo request timed out after ${this.timeoutMs}ms.`);
        throw error;
      } finally { clearTimeout(timer); }
    }
  }
}
