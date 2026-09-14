import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertProjectAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { QaseUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new QaseUpstream(config);
const server = new McpServer({ name: 'qase-mcp-connector', version: '1.0.0' });
const approvalId = z.string().regex(/^[a-f0-9]{64}$/i).optional();
const code = z.string().min(1).max(32).regex(/^[A-Z0-9_-]+$/i);
const id = z.union([z.number().int().nonnegative(), z.string().min(1).max(128)]);
const text = (max: number) => z.string().max(max).optional();
const resultStatus = z.enum(['passed','failed','blocked','skipped','invalid']);

function out(value: unknown) { return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] }; }
function clean<T extends Record<string, unknown>>(a: T) { const p = { ...a }; delete p.approvalId; return p; }
function guard(c: string) { assertProjectAllowed(config, c); }

server.tool('qase.project.context','Read project structure, suites, milestones, environments, custom fields and users.',{ code, full: z.boolean().optional() },async a=>{guard(a.code);return out(await upstream.call('qase_project_context',a));});
server.tool('qase.entity.get','Read a Qase entity by type and ID.',{ entity:z.enum(['case','suite','run','result','plan','defect','milestone','environment','shared_step','shared_parameter','configuration','attachment','author','user','custom_field','review']),code:code.optional(),id,fields:z.array(z.string().min(1).max(100)).max(50).optional(),include:z.string().max(200).optional() },async a=>{if(a.code)guard(a.code);return out(await upstream.call('qase_get',a));});
server.tool('qase.qql.search','Search Qase with QQL. Read-only.',{ query:z.string().min(1).max(2000),limit:z.number().int().min(1).max(100).optional(),offset:z.number().int().min(0).optional() },async a=>out(await upstream.call('qql_search',a)));
server.tool('qase.qql.help','Read one QQL reference section.',{ topic:z.enum(['overview','syntax','entities','operators','functions','examples','aggregation','enumValues']) },async a=>out(await upstream.call('qql_help',a)));

const caseSchema={code,id:z.number().int().positive().optional(),title:z.string().min(1).max(255),description:text(100000),preconditions:text(100000),postconditions:text(100000),severity:z.string().max(64).optional(),priority:z.string().max(64).optional(),type:z.string().max(64).optional(),layer:z.string().max(64).optional(),behavior:z.string().max(64).optional(),automation:z.string().max(64).optional(),status:z.string().max(64).optional(),is_flaky:z.boolean().optional(),suite_id:z.number().int().positive().optional(),milestone_id:z.number().int().positive().optional(),tags:z.array(z.string().max(100)).max(100).optional(),approvalId};
server.tool('qase.case.save','Create or update a test case. WRITE; explicit approval required.',caseSchema,async a=>{guard(a.code);const p=clean(a);assertApproval('qase.case.save',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_case_upsert',p));});

server.tool('qase.defect.save','Create or update a defect. WRITE; explicit approval required.',{code,id:z.number().int().positive().optional(),title:z.string().min(1).max(255),actual_result:text(100000),severity:z.string().max(64).optional(),status:z.enum(['open','in_progress','resolved','invalid']).optional(),tags:z.array(z.string().max(100)).max(100).optional(),approvalId},async a=>{guard(a.code);const p=clean(a);assertApproval('qase.defect.save',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_defect_upsert',p));});

server.tool('qase.run.save','Create or update a test run. WRITE; explicit approval required.',{code,id:z.number().int().positive().optional(),title:z.string().min(1).max(255),description:text(100000),environment_id:z.number().int().positive().optional(),milestone_id:z.number().int().positive().optional(),plan_id:z.number().int().positive().optional(),cases:z.array(z.number().int().positive()).max(5000).optional(),tags:z.array(z.string().max(100)).max(100).optional(),is_autotest:z.boolean().optional(),start_time:z.string().datetime().optional(),end_time:z.string().datetime().optional(),approvalId},async a=>{guard(a.code);const p=clean(a);assertApproval('qase.run.save',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_run_upsert',p));});

const oneResult=z.object({case_id:z.number().int().positive().optional(),status:resultStatus,comment:text(10000),stacktrace:text(50000),time_ms:z.number().int().nonnegative().optional(),defect:z.boolean().optional(),attachments:z.array(z.string().max(128)).max(20).optional()}).strict();
server.tool('qase.result.record','Record 1-200 results into a run. WRITE; explicit approval required.',{code,run_id:z.number().int().positive(),results:z.array(oneResult).min(1).max(200),approvalId},async a=>{guard(a.code);const p=clean(a);assertApproval('qase.result.record',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_result_record',p));});
server.tool('qase.ci.report','Create a CI run, record up to 2000 results, and optionally complete it. WRITE; explicit approval required.',{code,title:z.string().min(1).max(255),environment_id:z.number().int().positive().optional(),results:z.array(oneResult).min(1).max(2000),complete:z.boolean().optional(),is_autotest:z.boolean().optional(),approvalId},async a=>{guard(a.code);const p=clean(a);assertApproval('qase.ci.report',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_ci_report',p));});
server.tool('qase.regression.run.create','Create a regression run from suites, explicit cases or a plan. WRITE; explicit approval required.',{code,title:z.string().min(1).max(255),description:text(100000),environment_id:z.number().int().positive().optional(),milestone_id:z.number().int().positive().optional(),plan_id:z.number().int().positive().optional(),suite_ids:z.array(z.number().int().positive()).max(500).optional(),include_cases:z.array(z.number().int().positive()).max(5000).optional(),approvalId},async a=>{guard(a.code);const p=clean(a);assertApproval('qase.regression.run.create',p,a.approvalId,config.approvalSecret);return out(await upstream.call('qase_regression_run',p));});

const shutdown=()=>void upstream.close().finally(()=>server.close().finally(()=>process.exit(0)));
process.once('SIGINT',shutdown);process.once('SIGTERM',shutdown);
await server.connect(new StdioServerTransport());
