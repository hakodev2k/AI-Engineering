import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {z} from 'zod'; import {SentryClient,approve,enc} from './client.js';
const s=new McpServer({name:'sentry-connector',version:'1.0.0'}); const c=new SentryClient();
const org=z.string().min(1).max(200); const project=z.string().min(1).max(200); const id=z.string().min(1).max(200); const cursor=z.string().max(500).optional();
const out=(x:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({data:x,untrusted_provider_content:true})}]});
function tool(name:string,description:string,schema:any,fn:(a:any)=>Promise<any>){s.tool(name,description,schema,async a=>out(await fn(a)))}
tool('sentry.organization.list','READ. List organizations visible to the token.',{cursor},a=>c.request('GET',`/organizations/${a.cursor?`?cursor=${enc(a.cursor)}`:''}`));
tool('sentry.project.list','READ. List projects in an organization.',{organization:org,cursor},a=>c.request('GET',`/organizations/${enc(a.organization)}/projects/${a.cursor?`?cursor=${enc(a.cursor)}`:''}`));
tool('sentry.issue.list','READ. Search/list organization issues.',{organization:org,query:z.string().max(1000).optional(),cursor},a=>c.request('GET',`/organizations/${enc(a.organization)}/issues/?${new URLSearchParams(Object.fromEntries(Object.entries({query:a.query,cursor:a.cursor}).filter(([,v])=>v))).toString()}`));
tool('sentry.issue.get','READ. Retrieve an issue by ID.',{issueId:id},a=>c.request('GET',`/issues/${enc(a.issueId)}/`));
tool('sentry.event.list','READ. List events for a project.',{organization:org,project,cursor},a=>c.request('GET',`/projects/${enc(a.organization)}/${enc(a.project)}/events/${a.cursor?`?cursor=${enc(a.cursor)}`:''}`));
tool('sentry.event.get','READ. Retrieve a project event.',{organization:org,project,eventId:id},a=>c.request('GET',`/projects/${enc(a.organization)}/${enc(a.project)}/events/${enc(a.eventId)}/`));
tool('sentry.release.list','READ. List organization releases.',{organization:org,cursor},a=>c.request('GET',`/organizations/${enc(a.organization)}/releases/${a.cursor?`?cursor=${enc(a.cursor)}`:''}`));
tool('sentry.team.list','READ. List organization teams.',{organization:org,cursor},a=>c.request('GET',`/organizations/${enc(a.organization)}/teams/${a.cursor?`?cursor=${enc(a.cursor)}`:''}`));
tool('sentry.member.list','READ. List organization members.',{organization:org,query:z.string().max(500).optional(),cursor},a=>c.request('GET',`/organizations/${enc(a.organization)}/members/?${new URLSearchParams(Object.fromEntries(Object.entries({query:a.query,cursor:a.cursor}).filter(([,v])=>v))).toString()}`));
tool('sentry.issue.update','WRITE; human approval required. Update issue status/assignment.',{issueId:id,status:z.enum(['resolved','resolvedInNextRelease','unresolved','ignored']).optional(),assignedTo:z.string().max(200).optional()},a=>{approve('WRITE');const {issueId,...body}=a;return c.request('PUT',`/issues/${enc(issueId)}/`,body)});
tool('sentry.issue.delete','DESTRUCTIVE; human approval required. Delete an issue.',{issueId:id,confirm:z.literal('DELETE')},a=>{approve('DESTRUCTIVE');return c.request('DELETE',`/issues/${enc(a.issueId)}/`)});
await s.connect(new StdioServerTransport());
