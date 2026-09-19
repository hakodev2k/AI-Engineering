export type Risk = "READ" | "WRITE" | "HIGH_RISK" | "DESTRUCTIVE";

export class JotformError extends Error {
  constructor(public status: number, message: string, public retryAfter?: string) { super(message); }
}

export interface ClientOptions { apiKey: string; region?: "standard"|"eu"|"hipaa"; timeoutMs?: number; fetchImpl?: typeof fetch; }

export class JotformClient {
  private base: string; private f: typeof fetch; private timeout: number;
  constructor(private o: ClientOptions) {
    if (!o.apiKey) throw new Error("JOTFORM_API_KEY is required");
    this.base = o.region === "eu" ? "https://eu-api.jotform.com" : o.region === "hipaa" ? "https://hipaa-api.jotform.com" : "https://api.jotform.com";
    this.f = o.fetchImpl ?? fetch; this.timeout = o.timeoutMs ?? 15000;
  }
  async request(method:string, path:string, query:Record<string,string|number|undefined>={}, body?:URLSearchParams):Promise<any> {
    if (!path.startsWith("/")) throw new Error("Invalid API path");
    const u = new URL(path, this.base); for (const [k,v] of Object.entries(query)) if(v!==undefined) u.searchParams.set(k,String(v));
    const ac = new AbortController(); const timer=setTimeout(()=>ac.abort(),this.timeout);
    try {
      const r=await this.f(u,{method,headers:{APIKEY:this.o.apiKey,"Content-Type":"application/x-www-form-urlencoded"},body,signal:ac.signal});
      const text=await r.text(); let data:any; try{data=text?JSON.parse(text):{};}catch{data={message:text};}
      if(!r.ok || (data.responseCode && data.responseCode>=400)) throw new JotformError(r.status,data.message||`Jotform HTTP ${r.status}`,r.headers.get("retry-after")??undefined);
      return {content:data.content ?? data, rateLimitRemaining:data["limit-left"]};
    } catch(e:any) { if(e?.name==="AbortError") throw new JotformError(408,"Jotform request timed out"); throw e; } finally { clearTimeout(timer); }
  }
  listForms(limit=20,offset=0){return this.request("GET","/user/forms",{limit,offset});}
  getForm(id:string){return this.request("GET",`/form/${enc(id)}`);}
  getQuestions(id:string){return this.request("GET",`/form/${enc(id)}/questions`);}
  getSubmissions(id:string,limit=20,offset=0){return this.request("GET",`/form/${enc(id)}/submissions`,{limit,offset});}
  getSubmission(id:string){return this.request("GET",`/submission/${enc(id)}`);}
  createForm(title:string){const b=new URLSearchParams();b.set("properties[title]",title);return this.request("POST","/user/forms",{},b);}
  createQuestion(formId:string,q:{type:string;text:string;name:string;order:number;required?:boolean}){const b=new URLSearchParams(); for(const [k,v] of Object.entries(q)) b.set(`question[${k}]`,typeof v==="boolean"?(v?"Yes":"No"):String(v)); return this.request("POST",`/form/${enc(formId)}/questions`,{},b);}
  createSubmission(formId:string,answers:Record<string,string>){const b=new URLSearchParams();for(const [k,v] of Object.entries(answers))b.set(`submission[${k}]`,v);return this.request("POST",`/form/${enc(formId)}/submissions`,{},b);}
  createWebhook(formId:string,url:string){const b=new URLSearchParams({webhookURL:url});return this.request("POST",`/form/${enc(formId)}/webhooks`,{},b);}
  updateSubmission(id:string,answers:Record<string,string>){const b=new URLSearchParams();for(const [k,v] of Object.entries(answers))b.set(`submission[${k}]`,v);return this.request("POST",`/submission/${enc(id)}`,{},b);}
  deleteSubmission(id:string){return this.request("DELETE",`/submission/${enc(id)}`);}
}
function enc(v:string){if(!/^\d+$/.test(v))throw new Error("Jotform IDs must contain digits only");return encodeURIComponent(v);}
