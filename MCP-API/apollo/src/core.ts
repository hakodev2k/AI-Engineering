import { z } from 'zod';

export type Risk='READ'|'WRITE'|'HIGH_RISK';
export type ToolSpec={name:string;risk:Risk;approval:boolean;schema:z.ZodTypeAny;path:string;method:'GET'|'POST';};

export const tools:ToolSpec[]=[
 {name:'apollo.people.search',risk:'READ',approval:false,schema:z.object({query:z.string().min(1).max(200),page:z.number().int().min(1).max(100).default(1),perPage:z.number().int().min(1).max(100).default(25)}),path:'/mixed_people/search',method:'POST'},
 {name:'apollo.people.enrich',risk:'READ',approval:false,schema:z.object({email:z.string().email().optional(),firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),domain:z.string().max(253).optional()}).refine(v=>!!v.email||!!v.domain,'email or domain required'),path:'/people/match',method:'POST'},
 {name:'apollo.organization.search',risk:'READ',approval:false,schema:z.object({query:z.string().min(1).max(200),page:z.number().int().min(1).default(1)}),path:'/mixed_companies/search',method:'POST'},
 {name:'apollo.contact.create',risk:'WRITE',approval:true,schema:z.object({firstName:z.string().min(1).max(100),lastName:z.string().max(100).optional(),email:z.string().email().optional(),organizationName:z.string().max(200).optional()}),path:'/contacts',method:'POST'},
 {name:'apollo.contact.update',risk:'WRITE',approval:true,schema:z.object({id:z.string().min(1),firstName:z.string().max(100).optional(),lastName:z.string().max(100).optional(),title:z.string().max(200).optional()}),path:'/contacts/{id}',method:'POST'},
 {name:'apollo.sequence.list',risk:'READ',approval:false,schema:z.object({page:z.number().int().min(1).default(1)}),path:'/emailer_campaigns/search',method:'POST'},
 {name:'apollo.sequence.enroll',risk:'HIGH_RISK',approval:true,schema:z.object({sequenceId:z.string().min(1),contactIds:z.array(z.string().min(1)).min(1).max(100),emailAccountId:z.string().min(1),approved:z.literal(true)}),path:'/emailer_campaigns/{sequenceId}/add_contact_ids',method:'POST'},
 {name:'apollo.task.list',risk:'READ',approval:false,schema:z.object({page:z.number().int().min(1).default(1)}),path:'/tasks/search',method:'POST'},
 {name:'apollo.usage.read',risk:'READ',approval:false,schema:z.object({}),path:'/usage_stats/api_usage_stats',method:'POST'}
];

export class ApolloError extends Error{constructor(public status:number,message:string,public retryAfter?:number){super(message)}}

export class ApolloClient{
 constructor(private token:string,private base='https://api.apollo.io/api/v1',private timeout=15000,private retries=2){}
 async call(spec:ToolSpec,input:any){
  const data:any=spec.schema.parse(input); let path=spec.path;
  for(const [k,v] of Object.entries(data)) path=path.replace(`{${k}}`,encodeURIComponent(String(v)));
  if(spec.approval && process.env.APOLLO_APPROVE_WRITES!=='true' && data.approved!==true) throw new ApolloError(403,'Human approval required');
  for(let attempt=0;;attempt++){
   const c=new AbortController(); const t=setTimeout(()=>c.abort(),this.timeout);
   try{
    const r=await fetch(this.base+path,{method:spec.method,headers:{'content-type':'application/json','accept':'application/json','x-api-key':this.token},body:spec.method==='POST'?JSON.stringify(data):undefined,signal:c.signal});
    const text=await r.text(); const body=text?JSON.parse(text):{};
    if(r.ok)return {data:body,rateLimit:{minute:r.headers.get('x-rate-limit-minute-left'),hour:r.headers.get('x-rate-limit-hourly-left'),day:r.headers.get('x-rate-limit-daily-left')}};
    const ra=Number(r.headers.get('retry-after')||0); if((r.status===429||r.status>=500)&&attempt<this.retries){await new Promise(x=>setTimeout(x,Math.min((ra||2**attempt)*1000,10000)));continue}
    throw new ApolloError(r.status,body?.message||`Apollo HTTP ${r.status}`,ra||undefined);
   }finally{clearTimeout(t)}
  }
 }
}
