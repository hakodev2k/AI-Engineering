import { ConnectorError } from './core.js';
export interface SlackClientOptions { token?:string; timeoutMs?:number; maxRetries?:number; fetchImpl?:typeof fetch }
export class SlackClient {
  private token:string; private timeoutMs:number; private maxRetries:number; private f:typeof fetch;
  constructor(o:SlackClientOptions={}){this.token=o.token||process.env.SLACK_BOT_TOKEN||process.env.SLACK_USER_TOKEN||'';this.timeoutMs=o.timeoutMs??Number(process.env.SLACK_TIMEOUT_MS||15000);this.maxRetries=o.maxRetries??Number(process.env.SLACK_MAX_RETRIES||2);this.f=o.fetchImpl||fetch;if(!this.token)throw new ConnectorError('AUTH_MISSING','Set SLACK_BOT_TOKEN or SLACK_USER_TOKEN.');}
  async call(method:string,args:Record<string,unknown>={},signal?:AbortSignal){
    for(let attempt=0;;attempt++){
      const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),this.timeoutMs); const onAbort=()=>ctrl.abort(); signal?.addEventListener('abort',onAbort,{once:true});
      try{
        const r=await this.f(`https://slack.com/api/${method}`,{method:'POST',headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(args),signal:ctrl.signal});
        const retryAfter=Number(r.headers.get('retry-after')||0);
        if(r.status===429 && attempt<this.maxRetries){await new Promise(x=>setTimeout(x,Math.max(1,retryAfter)*1000));continue;}
        if(!r.ok)throw new ConnectorError(`HTTP_${r.status}`,`Slack HTTP ${r.status}`,retryAfter||undefined);
        const data=await r.json() as any;
        if(!data.ok){const code=String(data.error||'SLACK_ERROR');if(['invalid_auth','not_authed','account_inactive','missing_scope'].includes(code))throw new ConnectorError(code,`Slack authentication/permission error: ${code}`);throw new ConnectorError(code,`Slack API error: ${code}`);}
        return data;
      }catch(e){if(e instanceof ConnectorError)throw e;if(attempt>=this.maxRetries)throw new ConnectorError('NETWORK_ERROR',e instanceof Error?e.message:String(e));await new Promise(x=>setTimeout(x,250*2**attempt));}
      finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);}
    }
  }
}
