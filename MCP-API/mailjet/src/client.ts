import type { Config } from "./config.js";

export class MailjetError extends Error {
  constructor(public status:number, message:string, public retryAfter?:number) { super(message); this.name="MailjetError"; }
}

export class MailjetClient {
  constructor(private cfg:Config, private fetchFn:typeof fetch = fetch) {}
  private auth() { return `Basic ${Buffer.from(`${this.cfg.apiKey}:${this.cfg.secretKey}`).toString("base64")}`; }

  async request<T>(method:string, path:string, opts:{query?:Record<string,string|number|boolean|undefined>; body?:unknown; retryable?:boolean}={}):Promise<T> {
    const url = new URL(path, this.cfg.apiBase);
    for (const [k,v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k,String(v));
    let attempt=0;
    for (;;) {
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.cfg.timeoutMs);
      try {
        const res=await this.fetchFn(url,{method,headers:{Authorization:this.auth(),Accept:"application/json",...(opts.body?{"Content-Type":"application/json"}:{})},body:opts.body?JSON.stringify(opts.body):undefined,signal:controller.signal});
        const retryAfter=parseRetryAfter(res.headers.get("retry-after"));
        if (res.ok) return (res.status===204?{}:await res.json()) as T;
        const text=await res.text();
        const retryable=(opts.retryable ?? ["GET","HEAD"].includes(method)) && (res.status===429 || res.status>=500);
        if (retryable && attempt < this.cfg.maxRetries) { await sleep(retryAfter ?? 250*Math.pow(2,attempt)); attempt++; continue; }
        throw new MailjetError(res.status, safeMessage(text), retryAfter);
      } catch(e) {
        if (e instanceof MailjetError) throw e;
        if ((opts.retryable ?? ["GET","HEAD"].includes(method)) && attempt < this.cfg.maxRetries) { await sleep(250*Math.pow(2,attempt++)); continue; }
        if (e instanceof Error && e.name === "AbortError") throw new Error("Mailjet request timed out");
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}
function parseRetryAfter(v:string|null){ if(!v)return undefined; const n=Number(v); if(Number.isFinite(n)) return Math.max(0,n*1000); const d=Date.parse(v); return Number.isNaN(d)?undefined:Math.max(0,d-Date.now()); }
function safeMessage(text:string){ try { const x=JSON.parse(text); return String(x.ErrorMessage ?? x.ErrorInfo ?? x.message ?? "Mailjet API error"); } catch { return text.slice(0,500)||"Mailjet API error"; } }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,Math.min(ms,30000)));
