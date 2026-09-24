import {safeIndex,safeObjectId} from './policy.js';
export class AlgoliaClient{
 constructor(private app=process.env.ALGOLIA_APPLICATION_ID!,private key=process.env.ALGOLIA_API_KEY!,private timeout=Number(process.env.ALGOLIA_REQUEST_TIMEOUT_MS||10000)){if(!app||!key)throw new Error('Missing Algolia credentials');}
 private async req(index:string,path:string,init:RequestInit={}){safeIndex(index); const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),this.timeout); try{for(let a=0;a<3;a++){const r=await fetch(`https://${this.app}-dsn.algolia.net/1/indexes/${encodeURIComponent(index)}${path}`,{...init,signal:ctl.signal,headers:{'x-algolia-application-id':this.app,'x-algolia-api-key':this.key,'content-type':'application/json',...(init.headers||{})}}); if(r.ok)return r.status===204?{}:await r.json(); if(r.status===429||r.status>=500){if(a<2){await new Promise(x=>setTimeout(x,Math.min(2000,250*2**a)));continue;}} const body=await r.text(); throw new Error(`Algolia ${r.status}: ${body.slice(0,500)}`);} throw new Error('Algolia retry limit exceeded');}finally{clearTimeout(t)}}
 search(index:string,query:string,page=0,hitsPerPage=20){if(hitsPerPage<1||hitsPerPage>100)throw new Error('hitsPerPage 1..100');return this.req(index,'/query',{method:'POST',body:JSON.stringify({query,page,hitsPerPage})});}
 getObject(index:string,id:string){return this.req(index,`/${encodeURIComponent(safeObjectId(id))}`)}
 saveObject(index:string,id:string,obj:Record<string,unknown>){return this.req(index,`/${encodeURIComponent(safeObjectId(id))}`,{method:'PUT',body:JSON.stringify({...obj,objectID:id})})}
 partialUpdate(index:string,id:string,obj:Record<string,unknown>){return this.req(index,`/${encodeURIComponent(safeObjectId(id))}/partial`,{method:'POST',body:JSON.stringify(obj)})}
 deleteObject(index:string,id:string){return this.req(index,`/${encodeURIComponent(safeObjectId(id))}`,{method:'DELETE'})}
 getSettings(index:string){return this.req(index,'/settings')}
 updateSettings(index:string,settings:Record<string,unknown>){return this.req(index,'/settings',{method:'PUT',body:JSON.stringify(settings)})}
}
