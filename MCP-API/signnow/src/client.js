import { authHeaders } from './auth.js';

export class SignNowError extends Error { constructor(message, status, retryAfter) { super(message); this.name='SignNowError'; this.status=status; this.retryAfter=retryAfter; } }
const sleep = ms => new Promise(r => setTimeout(r, ms));

export class SignNowClient {
  constructor(config, fetchImpl = fetch) { this.config=config; this.fetch=fetchImpl; }
  async request(method, path, { body, query, retryable=true } = {}) {
    const url = new URL(this.config.baseUrl + path);
    for (const [k,v] of Object.entries(query || {})) if (v !== undefined) url.searchParams.set(k, String(v));
    for (let attempt=0;;attempt++) {
      const controller = new AbortController(); const timer=setTimeout(()=>controller.abort(), this.config.timeoutMs);
      try {
        const headers=authHeaders(this.config); let payload;
        if (body !== undefined) { headers['Content-Type']='application/json'; payload=JSON.stringify(body); }
        const res=await this.fetch(url,{method,headers,body:payload,signal:controller.signal});
        const text=await res.text(); let data=text; try { data=text?JSON.parse(text):null; } catch {}
        if (res.ok) return data;
        const retryAfter=res.headers.get('retry-after');
        const canRetry=retryable && ['GET','HEAD'].includes(method) && (res.status===429 || res.status>=500) && attempt<this.config.maxRetries;
        if (canRetry) { await sleep(retryAfter ? Math.min(Number(retryAfter)*1000,10000) : Math.min(250*2**attempt,4000)); continue; }
        throw new SignNowError(`SignNow API ${res.status}: ${typeof data==='string'?data:JSON.stringify(data)}`,res.status,retryAfter);
      } catch (e) {
        if (e?.name==='AbortError') throw new SignNowError('SignNow request timed out',408);
        if (e instanceof SignNowError) throw e;
        if (retryable && ['GET','HEAD'].includes(method) && attempt<this.config.maxRetries) { await sleep(Math.min(250*2**attempt,4000)); continue; }
        throw new SignNowError(`SignNow network error: ${e.message}`,0);
      } finally { clearTimeout(timer); }
    }
  }
  user() { return this.request('GET','/user'); }
  documents({page=1,perPage=50}={}) { return this.request('GET','/document',{query:{page,per_page:perPage}}); }
  document(id) { return this.request('GET',`/document/${encodeURIComponent(id)}`); }
  updateDocument(id, patch) { return this.request('PUT',`/document/${encodeURIComponent(id)}`,{body:patch,retryable:false}); }
  invite(id, payload) { return this.request('POST',`/document/${encodeURIComponent(id)}/invite`,{body:payload,retryable:false}); }
  webhooks() { return this.request('GET','/api/v2/events'); }
  createWebhook(payload) { return this.request('POST','/api/v2/events',{body:payload,retryable:false}); }
  uploadBase64(fileName, base64) { return this.request('POST','/document',{body:{file_name:fileName,file_base64:base64},retryable:false}); }
}
