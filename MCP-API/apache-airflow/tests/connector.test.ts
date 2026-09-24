import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { AirflowClient, AirflowError } from '../src/client.js';
import { createTools } from '../src/tools.js';

const original = {...process.env};
beforeEach(()=>{ process.env.AIRFLOW_ALLOW_WRITE='false'; delete process.env.AIRFLOW_APPROVAL_TOKEN; });
afterEach(()=>{ process.env={...original}; });

function client(handler:(url:string,init:RequestInit)=>Response|Promise<Response>) {
  return new AirflowClient('https://airflow.test','token',1000,0,handler as typeof fetch);
}

describe('Apache Airflow connector',()=>{
  it('rejects insecure remote base URLs',()=>expect(()=>new AirflowClient('http://example.com','x')).toThrow(/HTTPS/));
  it('registers meaningful tools',()=>expect(createTools(client(()=>new Response('{}'))).length).toBe(11));
  it('validates pagination bounds',()=>{ const t=createTools(client(()=>new Response('{}'))).find(x=>x.name==='airflow.dag.list')!; expect(()=>t.schema.parse({limit:101,offset:0})).toThrow(); });
  it('performs a read with bearer auth',async()=>{ let auth=''; const c=client((_u,i)=>{auth=new Headers(i.headers).get('authorization')??''; return new Response(JSON.stringify({dags:[]}),{status:200});}); const t=createTools(c).find(x=>x.name==='airflow.dag.list')!; expect((await t.run({limit:50,offset:0})).dags).toEqual([]); expect(auth).toBe('Bearer token'); });
  it('denies writes when disabled',async()=>{ const t=createTools(client(()=>new Response('{}'))).find(x=>x.name==='airflow.dag_run.trigger')!; await expect(t.run({dag_id:'etl',conf:{},approval_token:'yes'})).rejects.toThrow(/disabled/); });
  it('requires matching human approval',async()=>{ process.env.AIRFLOW_ALLOW_WRITE='true'; process.env.AIRFLOW_APPROVAL_TOKEN='approved'; const t=createTools(client(()=>new Response('{}'))).find(x=>x.name==='airflow.dag_run.trigger')!; await expect(t.run({dag_id:'etl',conf:{},approval_token:'wrong'})).rejects.toThrow(/approval/); });
  it('never retries a trigger write',async()=>{ process.env.AIRFLOW_ALLOW_WRITE='true'; process.env.AIRFLOW_APPROVAL_TOKEN='approved'; let calls=0; const t=createTools(client(()=>{calls++; return new Response(JSON.stringify({detail:'busy'}),{status:503});})).find(x=>x.name==='airflow.dag_run.trigger')!; await expect(t.run({dag_id:'etl',conf:{},approval_token:'approved'})).rejects.toBeInstanceOf(AirflowError); expect(calls).toBe(1); });
  it('maps API errors',async()=>{ const t=createTools(client(()=>new Response(JSON.stringify({detail:'forbidden'}),{status:403}))).find(x=>x.name==='airflow.dag.get')!; await expect(t.run({dag_id:'x'})).rejects.toMatchObject({status:403,message:'forbidden'}); });
});
