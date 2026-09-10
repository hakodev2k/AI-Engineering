import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { AnyZodObject } from 'zod';
import { loadConfig } from './config.js';
import { PingdomClient } from './client.js';
import { invoke, schemas } from './tools.js';

const config = loadConfig();
const client = new PingdomClient(config);
const server = new McpServer({ name: 'pingdom-connector', version: '1.0.0' });
const result = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

function register(name: string, description: string, schema: AnyZodObject) {
  server.tool(name, description, schema.shape, async (args) => result(await invoke(client, config, name, schema.parse(args) as Record<string, unknown>)));
}

register('pingdom.check.list', 'READ: List uptime checks with bounded pagination and optional tag filters.', schemas.checkList);
register('pingdom.check.get', 'READ: Get the detailed configuration and state of one uptime check.', schemas.checkGet);
register('pingdom.check.summary', 'READ: Retrieve average response-time and uptime summary data for a check.', schemas.checkSummary);
register('pingdom.probe.list', 'READ: List Pingdom probe servers.', schemas.probeList);
register('pingdom.alert.list', 'READ: List alert actions/events using bounded filters.', schemas.alertList);
register('pingdom.maintenance.list', 'READ: List maintenance windows.', schemas.maintenanceList);
register('pingdom.maintenance.get', 'READ: Get one maintenance window.', schemas.maintenanceGet);
register('pingdom.maintenance.occurrence.list', 'READ: List maintenance occurrences.', schemas.occurrenceList);
register('pingdom.account.credits.get', 'READ: Get current Pingdom account resource and SMS credit information.', schemas.empty);
register('pingdom.check.create', 'WRITE: Create an uptime check. Requires approval bound to the exact arguments.', schemas.checkCreate);
register('pingdom.check.update', 'WRITE: Modify one uptime check. Requires approval bound to the exact arguments.', schemas.checkUpdate);
register('pingdom.maintenance.create', 'WRITE: Create a maintenance window. Requires approval bound to the exact arguments.', schemas.maintenanceCreate);
register('pingdom.maintenance.update', 'WRITE: Modify a maintenance window. Requires approval bound to the exact arguments.', schemas.maintenanceUpdate);
register('pingdom.check.delete', 'DESTRUCTIVE: Irreversibly delete a check and collected data. Disabled by default and requires approval.', schemas.checkDelete);
register('pingdom.maintenance.delete', 'DESTRUCTIVE: Delete a future maintenance window. Disabled by default and requires approval.', schemas.maintenanceDelete);

await server.connect(new StdioServerTransport());
