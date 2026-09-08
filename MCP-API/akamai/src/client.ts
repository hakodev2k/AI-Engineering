import EdgeGrid from 'akamai-edgegrid';
import { config } from './config.js';

export class AkamaiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
    public readonly details?: unknown,
  ) { super(message); }
}

type RequestOptions = {
  method: 'GET' | 'POST';
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  retrySafe?: boolean;
};

export class AkamaiClient {
  private readonly edge: any;

  constructor() {
    const missing = [
      ['AKAMAI_CLIENT_TOKEN', config.clientToken],
      ['AKAMAI_CLIENT_SECRET', config.clientSecret],
      ['AKAMAI_ACCESS_TOKEN', config.accessToken],
      ['AKAMAI_HOST', config.host],
    ].filter(([, value]) => !value).map(([name]) => name);
    if (missing.length) throw new Error(`Missing Akamai credentials: ${missing.join(', ')}`);
    this.edge = new (EdgeGrid as any)(config.clientToken, config.clientSecret, config.accessToken, config.host);
    this.edge.enableLogging(false);
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const query = { ...(options.query ?? {}) };
    if (config.accountSwitchKey && query.accountSwitchKey === undefined) query.accountSwitchKey = config.accountSwitchKey;
    const attempts = options.retrySafe ? config.maxRetries + 1 : 1;
    let last: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await this.once<T>({ ...options, query });
      } catch (error) {
        last = error;
        const e = error as AkamaiError;
        if (attempt + 1 >= attempts || !this.retryable(e)) throw error;
        const delay = e.retryAfterSeconds !== undefined
          ? Math.min(e.retryAfterSeconds * 1000, 30000)
          : Math.min(250 * 2 ** attempt + Math.floor(Math.random() * 100), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw last;
  }

  private retryable(error: AkamaiError): boolean {
    return error.status === 429 || error.status === 502 || error.status === 503 || error.status === 504 || error.status === undefined;
  }

  private once<T>(options: RequestOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new AkamaiError(`Akamai request timed out after ${config.timeoutMs}ms`)), config.timeoutMs);
      const req = this.edge.auth({
        path: options.path,
        method: options.method,
        headers: { Accept: 'application/json', ...(options.headers ?? {}) },
        qs: Object.fromEntries(Object.entries(options.query ?? {}).filter(([, v]) => v !== undefined)),
        body: options.body ?? {},
      });
      req.send((error: unknown, response: any, body: unknown) => {
        clearTimeout(timer);
        if (error) return reject(new AkamaiError('Akamai network/authentication request failed', undefined, undefined, error));
        const status = Number(response?.statusCode ?? response?.status);
        const headers = response?.headers ?? {};
        const retryHeader = headers['retry-after'] ?? headers['Retry-After'];
        const retryAfterSeconds = retryHeader !== undefined && Number.isFinite(Number(retryHeader)) ? Number(retryHeader) : undefined;
        let parsed: any = body;
        if (typeof body === 'string' && body.length) {
          try { parsed = JSON.parse(body); } catch { parsed = body; }
        }
        if (!(status >= 200 && status < 300)) {
          const message = parsed?.detail ?? parsed?.title ?? parsed?.message ?? `Akamai API error ${status}`;
          return reject(new AkamaiError(String(message), status, retryAfterSeconds, parsed));
        }
        resolve(parsed as T);
      });
    });
  }
}
