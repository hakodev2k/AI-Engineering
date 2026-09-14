import { setTimeout as sleep } from "node:timers/promises";

export class MixpanelError extends Error {
  constructor(public status: number, public code: string, message: string, public retryAfterSeconds?: number) { super(message); }
}

type Region = "us"|"eu"|"in";
const HOSTS: Record<Region,{query:string;data:string}> = {
  us: { query:"https://mixpanel.com", data:"https://data.mixpanel.com" },
  eu: { query:"https://eu.mixpanel.com", data:"https://data-eu.mixpanel.com" },
  in: { query:"https://in.mixpanel.com", data:"https://data-in.mixpanel.com" }
};

export class MixpanelClient {
  private readonly region: Region;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  constructor(private user=process.env.MIXPANEL_SERVICE_ACCOUNT_USERNAME, private secret=process.env.MIXPANEL_SERVICE_ACCOUNT_SECRET, private projectId=process.env.MIXPANEL_PROJECT_ID) {
    const r=(process.env.MIXPANEL_REGION||"us").toLowerCase();
    if (!(r in HOSTS)) throw new MixpanelError(400,"INVALID_REGION","MIXPANEL_REGION must be us, eu, or in.");
    this.region=r as Region; this.timeoutMs=Number(process.env.MIXPANEL_TIMEOUT_MS||30000); this.maxRetries=Math.min(5,Math.max(0,Number(process.env.MIXPANEL_MAX_RETRIES||2)));
  }
  private auth(): string {
    if(!this.user||!this.secret||!this.projectId) throw new MixpanelError(401,"MISSING_CREDENTIAL","Mixpanel service-account credentials and project ID are required.");
    return `Basic ${Buffer.from(`${this.user}:${this.secret}`).toString("base64")}`;
  }
  private async call(base:"query"|"data", path:string, params:URLSearchParams, format:"json"|"ndjson"="json"): Promise<any> {
    if(!this.projectId) this.auth();
    params.set("project_id",this.projectId!);
    const url=`${HOSTS[this.region][base]}${path}?${params}`;
    for(let attempt=0;;attempt++){
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.timeoutMs);
      try{
        const res=await fetch(url,{headers:{Authorization:this.auth(),Accept:format==="ndjson"?"text/plain":"application/json"},signal:controller.signal});
        const body=await res.text();
        if(res.ok){
          if(format==="ndjson") return body.split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));
          return body?JSON.parse(body):null;
        }
        const retryAfter=Number(res.headers.get("retry-after")||0)||undefined;
        const err=new MixpanelError(res.status,`HTTP_${res.status}`,body.slice(0,1000)||res.statusText,retryAfter);
        if(![429,500,502,503,504].includes(res.status)||attempt>=this.maxRetries) throw err;
        await sleep(Math.min(60000,retryAfter?retryAfter*1000:2000*(2**attempt)+Math.floor(Math.random()*1000)));
      } catch(e){
        if(e instanceof MixpanelError) throw e;
        if(attempt>=this.maxRetries) throw e;
        await sleep(Math.min(10000,500*(2**attempt)));
      } finally { clearTimeout(timer); }
    }
  }
  query(path:string, params:URLSearchParams){return this.call("query",path,params,"json");}
  export(params:URLSearchParams){return this.call("data","/api/2.0/export",params,"ndjson");}
}
