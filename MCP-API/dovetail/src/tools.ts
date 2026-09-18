import{z}from'zod';import type{McpServer}from'@modelcontextprotocol/sdk/server/mcp.js';import type{Config,Risk}from'./config.js';import{DovetailClient}from'./client.js';import{DovetailMcp}from'./upstream-mcp.js';import{authorize,bounded,resourceId}from'./policy.js';
const result=(x:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({data:x,untrusted:true})}]});const approved={approved:z.boolean().default(false)};const rid=z.string().regex(/^[0-9A-Za-z]{22}$/);const fmt=z.enum(['markdown','html','text']);
export function registerTools(s:McpServer,c:Config,a:DovetailClient,m:DovetailMcp){const tool=(name:string,description:string,schema:any,risk:Risk,fn:(x:any)=>Promise<any>)=>s.tool(name,description,schema,async(x:any)=>{authorize(c,risk,x.approved===true);return result(await fn(x))});
 tool('dovetail.workspace.search','Search workspace via official Dovetail MCP.',{query:z.string().min(1).max(500)},'READ',x=>m.search(bounded(x.query,'query',500)));
 tool('dovetail.project.list','List projects with bounded cursor pagination.',{},'READ',()=>a.listAll('/v1/projects'));
 tool('dovetail.project.get','Get project metadata.',{projectId:rid},'READ',x=>a.request('GET','/v1/projects/'+resourceId(x.projectId)));
 tool('dovetail.data.list','List research data entries.',{},'READ',()=>a.listAll('/v1/data'));
 tool('dovetail.data.get','Get research data metadata.',{dataId:rid},'READ',x=>a.request('GET','/v1/data/'+resourceId(x.dataId)));
 tool('dovetail.data.export','Export research data content.',{dataId:rid,type:fmt.default('markdown')},'READ',x=>a.request('GET','/v1/data/'+resourceId(x.dataId)+'/export/'+x.type));
 tool('dovetail.doc.list','List docs.',{},'READ',()=>a.listAll('/v1/docs'));
 tool('dovetail.doc.get','Get doc metadata.',{docId:rid},'READ',x=>a.request('GET','/v1/docs/'+resourceId(x.docId)));
 tool('dovetail.doc.export','Export doc content.',{docId:rid,type:fmt.default('markdown')},'READ',x=>a.request('GET','/v1/docs/'+resourceId(x.docId)+'/export/'+x.type));
 tool('dovetail.doc.create','Create a doc.',{...approved,title:z.string().min(1).max(500),content:z.string().max(5000000),contentType:fmt.default('markdown'),projectId:rid.optional(),folderId:rid.optional()},'WRITE',x=>{if(x.projectId&&x.folderId)throw new Error('projectId and folderId are mutually exclusive');return a.request('POST','/v1/docs',{title:bounded(x.title,'title',500),content:x.content,content_type:x.contentType,project_id:x.projectId,folder_id:x.folderId},false)});
 tool('dovetail.doc.update','Update a doc title/content.',{...approved,docId:rid,title:z.string().min(1).max(500).optional(),content:z.string().max(5000000).optional(),contentType:fmt.optional()},'WRITE',x=>{if(!x.title&&!x.content)throw new Error('title or content required');return a.request('PATCH','/v1/docs/'+resourceId(x.docId),{title:x.title,content:x.content,content_type:x.contentType},false)});
 tool('dovetail.doc.delete','Delete a doc.',{...approved,docId:rid},'DESTRUCTIVE',x=>a.request('DELETE','/v1/docs/'+resourceId(x.docId),undefined,false));
}
