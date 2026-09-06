import type { Config } from "./config.js";

export class LokaliseApiError extends Error {
  constructor(public status:number, message:string, public retryAfter?:string) { super(message); }
}
const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));
export class LokaliseClient {
  constructor(private config:Config, private fetcher:typeof fetch = fetch) {}
  async request(method:string, path:string, body?:unknown, query?:Record<string,string|number|undefined>) {
    const url = new URL(`https://api.lokalise.com/api2${path}`);
    for (const [k,v] of Object.entries(query ?? {})) if (v !== undefined) url.searchParams.set(k,String(v));
    for (let attempt=0;;attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        const headers:Record<string,string> = { Accept:"application/json" };
        if (body !== undefined) headers["Content-Type"] = "application/json";
        if (this.config.oauthToken) headers.Authorization = `Bearer ${this.config.oauthToken}`;
        else headers["X-Api-Token"] = this.config.apiToken!;
        const res = await this.fetcher(url,{ method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal });
        const text = await res.text();
        let data:unknown = text; try { data = text ? JSON.parse(text) : null; } catch {}
        if (res.ok) return data;
        const retryable = [429,502,503,504].includes(res.status) && method === "GET" && attempt < this.config.maxRetries;
        if (retryable) { const ra=res.headers.get("retry-after"); await sleep(ra ? Math.min(Number(ra)*1000,10000) : Math.min(500*2**attempt,4000)); continue; }
        throw new LokaliseApiError(res.status, typeof data === "object" ? JSON.stringify(data) : String(data), res.headers.get("retry-after") ?? undefined);
      } catch (e) {
        if (e instanceof LokaliseApiError) throw e;
        if (e instanceof Error && e.name === "AbortError") throw new Error(`Lokalise request timed out after ${this.config.timeoutMs}ms.`);
        if (method === "GET" && attempt < this.config.maxRetries) { await sleep(Math.min(500*2**attempt,4000)); continue; }
        throw e;
      } finally { clearTimeout(timer); }
    }
  }
}
