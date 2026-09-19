import {z} from 'zod'; import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'; import type {KintoneClient} from './client.js'; import type {KintoneConfig} from './auth.js'; import {authorize,toolPolicy} from './policy.js';
const app=z.number().int().positive(), id=z.number().int().positive(), approved=z.boolean().default(false), record=z.record(z.string(),z.unknown());
const out=(v:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({untrustedProviderData:true,data:v})}]});
export function registerTools(s:McpServer,c:KintoneClient,cfg:KintoneConfig){
 const reg=(name:keyof typeof toolPolicy,desc:string,schema:any,fn:(a:any)=>Promise<unknown>)=>s.tool(name,desc,schema,async(a:any)=>{authorize(cfg,toolPolicy[name],a.approved===true);return out(await fn(a))});
 reg('kintone.app.get','Get app metadata. READ.',{app},a=>c.getApp(a.app));
 reg('kintone.fields.get','Get app field definitions. READ.',{app},a=>c.getFields(a.app));
 reg('kintone.record.get','Get one record. READ.',{app,id},a=>c.getRecord(a.app,a.id));
 reg('kintone.records.list','Query up to 500 records. READ.',{app,query:z.string().max(4096).default(''),fields:z.array(z.string().min(1).max(128)).max(100).default([])},a=>c.listRecords(a.app,a.query,a.fields));
 reg('kintone.record.create','Create one record. WRITE; approval follows connector policy.',{app,record,approved},a=>c.createRecord(a.app,a.record));
 reg('kintone.record.update','Update one record. WRITE; revision enables optimistic concurrency.',{app,id,record,revision:z.number().int().nonnegative().optional(),approved},a=>c.updateRecord(a.app,a.id,a.record,a.revision));
 reg('kintone.records.delete','Delete 1-100 records. DESTRUCTIVE; disabled by default and requires approval.',{app,ids:z.array(id).min(1).max(100),revisions:z.array(z.number().int().nonnegative()).max(100).optional(),approved},a=>{if(a.revisions&&a.revisions.length!==a.ids.length)throw new Error('revisions length must equal ids length');return c.deleteRecords(a.app,a.ids,a.revisions)});
 reg('kintone.comments.list','List record comments. READ.',{app,record:id,order:z.enum(['asc','desc']).default('desc'),offset:z.number().int().nonnegative().max(10000).default(0)},a=>c.listComments(a.app,a.record,a.order,a.offset));
 reg('kintone.comment.add','Post an external record comment. HIGH_RISK; explicit approval required.',{app,record:id,text:z.string().min(1).max(65535),mentions:z.array(z.object({code:z.string().min(1).max(128),type:z.enum(['USER','GROUP','ORGANIZATION'])})).max(10).default([]),approved},a=>c.addComment(a.app,a.record,a.text,a.mentions));
 reg('kintone.status.update','Apply a configured process-management action. WRITE; approval follows connector policy.',{app,id,action:z.string().min(1).max(128),assignee:z.string().min(1).max(128).optional(),revision:z.number().int().nonnegative().optional(),approved},a=>c.updateStatus(a.app,a.id,a.action,a.assignee,a.revision));
 reg('kintone.permissions.evaluate','Evaluate record/field permissions for record IDs. READ.',{app,ids:z.array(id).min(1).max(100)},a=>c.evaluatePermissions(a.app,a.ids));
}
