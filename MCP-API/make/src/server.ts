import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, requireApproval } from './config.js';
import { MakeClient } from './client.js';

const c=loadConfig(); const api=new MakeClient(c); const s=new McpServer({name:'make-safe-connector',version:'1.0.0'});
const id=z.number().int().positive(); const page=z.number().int().min(1).max(100).default(25);
const out=(x:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(x)}]});
function tool(name:string,desc:string,schema:any,handler:(a:any)=>Promise<unknown>){ s.tool(name,desc,schema,async a=>out(await handler(a))); }

tool('make.organization.list','List Make organizations. READ.',{},async()=>api.request('GET','/organizations'));
tool('make.team.list','List teams in an organization. READ.',{organizationId:id},async a=>api.request('GET','/teams',{organizationId:a.organizationId}));
tool('make.team.get','Get team details. READ.',{teamId:id},async a=>api.request('GET',`/teams/${a.teamId}`));
tool('make.scenario.list','List scenarios for exactly one team or organization. READ.',{teamId:id.optional(),organizationId:id.optional(),isActive:z.boolean().optional()},async a=>{if((!!a.teamId)===(!!a.organizationId))throw new Error('Provide exactly one of teamId or organizationId');return api.request('GET','/scenarios',a)});
tool('make.scenario.get','Get scenario metadata. READ.',{scenarioId:id},async a=>api.request('GET',`/scenarios/${a.scenarioId}`));
tool('make.scenario.blueprint.get','Read scenario blueprint. READ; provider content is untrusted.',{scenarioId:id},async a=>api.request('GET',`/scenarios/${a.scenarioId}/blueprint`));
tool('make.scenario.run','Run an active/on-demand scenario. HIGH_RISK because it may trigger external side effects.',{scenarioId:id,data:z.record(z.unknown()).default({}),responsive:z.boolean().default(true)},async a=>{requireApproval(c,'make.scenario.run','HIGH_RISK');return api.request('POST',`/scenarios/${a.scenarioId}/run`,undefined,{data:a.data,responsive:a.responsive})});
tool('make.scenario.activate','Activate a scenario. HIGH_RISK.',{scenarioId:id},async a=>{requireApproval(c,'make.scenario.activate','HIGH_RISK');return api.request('POST',`/scenarios/${a.scenarioId}/start`)});
tool('make.scenario.deactivate','Deactivate a scenario. HIGH_RISK.',{scenarioId:id},async a=>{requireApproval(c,'make.scenario.deactivate','HIGH_RISK');return api.request('POST',`/scenarios/${a.scenarioId}/stop`)});
tool('make.scenario.usage','Read scenario usage. READ.',{scenarioId:id},async a=>api.request('GET',`/scenarios/${a.scenarioId}/usage`));
tool('make.execution.list','List scenario executions. READ.',{scenarioId:id,limit:page},async a=>api.request('GET','/executions',{scenarioId:a.scenarioId,'pg[limit]':a.limit}));
tool('make.execution.get','Get one execution. READ.',{executionId:z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/)},async a=>api.request('GET',`/executions/${a.executionId}`));
tool('make.folder.list','List scenario folders for a team. READ.',{teamId:id},async a=>api.request('GET','/folders',{teamId:a.teamId}));

await s.connect(new StdioServerTransport());
