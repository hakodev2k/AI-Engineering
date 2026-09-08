import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TriggerClient } from './client.js';
import { requireRisk } from './policy.js';
import { buildRunQuery, schemas } from './tools.js';

const server = new McpServer({ name: 'trigger-dev-connector', version: '1.0.0' });
const client = new TriggerClient();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('trigger-dev.task.trigger', 'Trigger a task. WRITE; approval required unless configured.', schemas.taskTrigger.shape, async (raw) => { const v=schemas.taskTrigger.parse(raw); requireRisk('WRITE',v.approved); return out(await client.triggerTask(v.task,v.payload,v.options)); });
server.tool('trigger-dev.task.batch_trigger', 'Batch trigger up to 1000 task payloads. WRITE.', schemas.batchTrigger.shape, async (raw) => { const v=schemas.batchTrigger.parse(raw); requireRisk('WRITE',v.approved); return out(await client.batchTriggerTask(v.task,v.items)); });
server.tool('trigger-dev.run.list', 'List runs with bounded filters. READ.', schemas.runList.shape, async (raw) => { const v=schemas.runList.parse(raw); return out(await client.listRuns(buildRunQuery(v))); });
server.tool('trigger-dev.run.get', 'Retrieve run details. READ.', schemas.runId.shape, async (raw) => { const v=schemas.runId.parse(raw); return out(await client.getRun(v.runId)); });
server.tool('trigger-dev.run.cancel', 'Cancel an in-progress run. HIGH_RISK; explicit approval.', schemas.runApproved.shape, async (raw) => { const v=schemas.runApproved.parse(raw); requireRisk('HIGH_RISK',v.approved); return out(await client.cancelRun(v.runId)); });
server.tool('trigger-dev.run.replay', 'Replay a prior run against latest version. HIGH_RISK; explicit approval.', schemas.runApproved.shape, async (raw) => { const v=schemas.runApproved.parse(raw); requireRisk('HIGH_RISK',v.approved); return out(await client.replayRun(v.runId)); });
server.tool('trigger-dev.run.reschedule', 'Reschedule a DELAYED run. WRITE.', schemas.reschedule.shape, async (raw) => { const v=schemas.reschedule.parse(raw); requireRisk('WRITE',v.approved); return out(await client.rescheduleRun(v.runId,v.delay)); });
server.tool('trigger-dev.batch.get', 'Retrieve batch metadata and run IDs. READ.', schemas.batchId.shape, async (raw) => { const v=schemas.batchId.parse(raw); return out(await client.getBatch(v.batchId)); });
server.tool('trigger-dev.batch.results', 'Retrieve completed batch results. READ.', schemas.batchId.shape, async (raw) => { const v=schemas.batchId.parse(raw); return out(await client.getBatchResults(v.batchId)); });
server.tool('trigger-dev.schedule.list', 'List schedules. READ.', schemas.scheduleList.shape, async (raw) => { const v=schemas.scheduleList.parse(raw); return out(await client.listSchedules(v.page,v.perPage)); });
server.tool('trigger-dev.schedule.get', 'Retrieve a schedule. READ.', schemas.scheduleId.shape, async (raw) => { const v=schemas.scheduleId.parse(raw); return out(await client.getSchedule(v.scheduleId)); });

await server.connect(new StdioServerTransport());
