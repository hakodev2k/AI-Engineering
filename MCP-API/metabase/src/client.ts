import type { Config } from './config.js';

export class MetabaseError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}

export class MetabaseClient {
  constructor(private cfg: Config, private fetchImpl: typeof fetch = fetch) {}

  async request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const url = new URL(path, this.cfg.METABASE_BASE_URL);
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.cfg.METABASE_TIMEOUT_MS);
      const relay = () => controller.abort();
      signal?.addEventListener('abort', relay, {once:true});
      try {
        const res = await this.fetchImpl(url, {
          method,
          headers: {'X-API-Key': this.cfg.METABASE_API_KEY, 'Content-Type':'application/json', 'Accept':'application/json'},
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal
        });
        const text = await res.text();
        const data = text ? safeJson(text) : null;
        if (res.ok) return data as T;
        const retryAfter = parseRetryAfter(res.headers.get('retry-after'));
        const retriable = [429,502,503,504].includes(res.status) && method === 'GET';
        if (retriable && attempt < this.cfg.METABASE_MAX_RETRIES) {
          const wait = retryAfter ?? Math.min(4000, 250 * 2 ** attempt);
          attempt++;
          await sleep(wait, signal);
          continue;
        }
        throw new MetabaseError(res.status, `metabase_api_error: ${extractMessage(data, text)}`, retryAfter);
      } catch (e) {
        if (e instanceof MetabaseError) throw e;
        if ((e as Error).name === 'AbortError') throw new Error('timeout_or_cancelled');
        if (method === 'GET' && attempt < this.cfg.METABASE_MAX_RETRIES) {
          await sleep(Math.min(4000, 250 * 2 ** attempt++), signal);
          continue;
        }
        throw new Error(`network_error: ${(e as Error).message}`);
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', relay);
      }
    }
  }
}

function safeJson(text:string): unknown { try { return JSON.parse(text); } catch { return {message:text}; } }
function extractMessage(data:unknown, fallback:string): string {
  if (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string') return (data as any).message;
  return fallback.slice(0,500);
}
function parseRetryAfter(v:string|null): number|undefined {
  if (!v) return undefined; const n=Number(v); if(Number.isFinite(n)) return Math.max(0,n*1000);
  const d=Date.parse(v); return Number.isNaN(d)?undefined:Math.max(0,d-Date.now());
}
function sleep(ms:number, signal?:AbortSignal): Promise<void> { return new Promise((r,j)=>{ const t=setTimeout(r,ms); signal?.addEventListener('abort',()=>{clearTimeout(t);j(new Error('cancelled'));},{once:true});}); }
