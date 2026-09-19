import type {KintoneConfig} from './auth.js';
export class KintoneError extends Error { constructor(public status:number,public code:string|undefined,message:string,public retryAfter?:number){super(message)} }
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export class KintoneClient{
 constructor(private c:KintoneConfig,private fetcher:typeof fetch=fetch){}
 private base(){const p=this.c.guestSpaceId?`/k/guest/${this.c.guestSpaceId}/v1`:'/k/v1';return `https://${this.c.subdomain}.kintone.com${p}`}
 async request<T>(method:string,path:string,body?:unknown,signal?:AbortSignal):Promise<T>{
  const retryable=['GET'];
  for(let attempt=0;;attempt++){
   const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),this.c.timeoutMs); const onAbort=()=>controller.abort(); signal?.addEventListener('abort',onAbort,{once:true});
   try{
    const res=await this.fetcher(`${this.base()}${path}`,{method,headers:{'X-Cybozu-API-Token':this.c.apiTokens.join(','),'Content-Type':'application/json','Accept':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
    const text=await res.text(); let data:any={}; try{data=text?JSON.parse(text):{}}catch{data={message:text}}
    if(res.ok) return data as T;
    const raw=res.headers.get('retry-after'); const retryAfter=raw===null?undefined:Number(raw);
    if((res.status===429||res.status>=500)&&retryable.includes(method)&&attempt<this.c.maxRetries){await sleep(retryAfter!==undefined&&Number.isFinite(retryAfter)?retryAfter*1000:Math.min(500*2**attempt,5000));continue}
    throw new KintoneError(res.status,data.code,data.message??`Kintone HTTP ${res.status}`,retryAfter!==undefined&&Number.isFinite(retryAfter)?retryAfter:undefined);
   }catch(e){if(e instanceof KintoneError)throw e;if(attempt<this.c.maxRetries&&retryable.includes(method)&&!(e instanceof DOMException&&e.name==='AbortError')){await sleep(Math.min(500*2**attempt,5000));continue}throw e}
   finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort)}
  }
 }
 getApp(app:number){return this.request('GET',`/app.json?app=${app}`)}
 getFields(app:number){return this.request('GET',`/app/form/fields.json?app=${app}`)}
 getRecord(app:number,id:number){return this.request('GET',`/record.json?app=${app}&id=${id}`)}
 listRecords(app:number,query:string='',fields:string[]=[]){const q=new URLSearchParams({app:String(app),query});fields.forEach((f,i)=>q.append(`fields[${i}]`,f));return this.request('GET',`/records.json?${q}`)}
 createRecord(app:number,record:Record<string,unknown>){return this.request('POST','/record.json',{app,record})}
 updateRecord(app:number,id:number,record:Record<string,unknown>,revision?:number){return this.request('PUT','/record.json',{app,id,record,...(revision===undefined?{}:{revision})})}
 deleteRecords(app:number,ids:number[],revisions?:number[]){return this.request('DELETE','/records.json',{app,ids,...(revisions?{revisions}:{})})}
 listComments(app:number,record:number,order:'asc'|'desc'='desc',offset=0){return this.request('GET',`/record/comments.json?${new URLSearchParams({app:String(app),record:String(record),order,offset:String(offset)})}`)}
 addComment(app:number,record:number,text:string,mentions:{code:string,type:'USER'|'GROUP'|'ORGANIZATION'}[]=[]){return this.request('POST','/record/comment.json',{app,record,comment:{text,mentions}})}
 updateStatus(app:number,id:number,action:string,assignee?:string,revision?:number){return this.request('PUT','/record/status.json',{app,id,action,...(assignee?{assignee}:{}),...(revision===undefined?{}:{revision})})}
 evaluatePermissions(app:number,ids:number[]){return this.request('POST','/records/acl/evaluate.json',{app,ids})}
}
