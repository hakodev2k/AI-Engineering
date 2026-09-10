import type { Config } from './config.js';

export class ContentstackError extends Error {
  constructor(public status:number, message:string, public retryAfterMs?:number) { super(message); }
}

const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));

export class ContentstackClient {
  constructor(private readonly config:Config, private readonly fetchImpl:typeof fetch = fetch) {}

  async request<T>(method:'GET'|'POST'|'PUT'|'DELETE', path:string, opts:{query?:Record<string,string|number|boolean|undefined>, body?:unknown, retryable?:boolean, signal?:AbortSignal} = {}):Promise<T> {
    if (!path.startsWith('/') || path.includes('://')) throw new Error('Provider path must be relative');
    const url = new URL(this.config.baseUrl + path);
    for (const [k,v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k,String(v));
    const attempts = opts.retryable === false || method !== 'GET' ? 1 : this.config.maxRetries + 1;
    let last:unknown;
    for (let attempt=0; attempt<attempts; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(()=>controller.abort(), this.config.timeoutMs);
      const onAbort = ()=>controller.abort();
      opts.signal?.addEventListener('abort',onAbort,{once:true});
      try {
        const response = await this.fetchImpl(url, {
          method,
          headers: {
            'api_key': this.config.apiKey,
            'authorization': this.config.managementToken,
            'branch': this.config.branch,
            'content-type':'application/json'
          },
          body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
          signal: controller.signal
        });
        const text = await response.text();
        const parsed = text ? JSON.parse(text) : {};
        if (response.ok) return parsed as T;
        const retryAfter = response.headers.get('retry-after');
        const retryAfterMs = retryAfter && /^\d+$/.test(retryAfter) ? Math.min(Number(retryAfter)*1000,10000) : undefined;
        const message = parsed?.error_message ?? parsed?.message ?? `Contentstack HTTP ${response.status}`;
        const err = new ContentstackError(response.status,String(message),retryAfterMs);
        if (!(response.status === 429 || [502,503,504].includes(response.status)) || attempt === attempts-1) throw err;
        await sleep(retryAfterMs ?? Math.min(250 * 2**attempt, 4000));
      } catch (error) {
        last = error;
        if (error instanceof ContentstackError) {
          if (error.status < 500 && error.status !== 429) throw error;
          if (attempt === attempts-1) throw error;
        } else if (attempt === attempts-1) {
          if (controller.signal.aborted) throw new Error(`Contentstack request timed out after ${this.config.timeoutMs}ms`);
          throw error;
        } else {
          await sleep(Math.min(250 * 2**attempt, 4000));
        }
      } finally {
        clearTimeout(timer);
        opts.signal?.removeEventListener('abort',onAbort);
      }
    }
    throw last instanceof Error ? last : new Error('Contentstack request failed');
  }
}
