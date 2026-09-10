import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { AnyZodObject } from "zod";
import { loadConfig } from "../config.js";
import { PrefectApiClient } from "../client/prefectApi.js";
import { PrefectMcpTransport } from "../transport/prefectMcp.js";
import { invoke, schemas, type ToolName } from "../tools/index.js";

const config = loadConfig();
const upstream = new PrefectMcpTransport(config);
const api = new PrefectApiClient(config);
const server = new McpServer({ name: "prefect-cloud-connector", version: "1.0.0" });

function ok(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value) }] };
}

function fail(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown connector error";
  return { isError: true, content: [{ type: "text" as const, text: JSON.stringify({ error: message }) }] };
}

function register(name: ToolName, description: string, schema: AnyZodObject): void {
  server.tool(name, description, schema.shape, async (raw) => {
    try {
      const args = schema.parse(raw) as Record<string, unknown>;
      return ok(await invoke(upstream, api, config, name, args));
    } catch (error) {
      return fail(error);
    }
  });
}

register("prefect-cloud.identity.get", "READ: Inspect the authenticated Prefect identity and target instance/workspace. No approval required.", schemas.identity);
register("prefect-cloud.workspace.list_authorized", "READ: List Prefect Cloud workspaces authorized by hosted MCP OAuth. No approval required.", schemas.workspaces);
register("prefect-cloud.dashboard.get", "READ: Retrieve Prefect health, run, work-pool, and concurrency summaries. No approval required.", schemas.dashboard);
register("prefect-cloud.deployment.list", "READ: List/filter deployments. Uses official MCP first and REST filter fallback when configured. No approval required.", schemas.list200);
register("prefect-cloud.flow.list", "READ: List/filter flows. Uses official MCP first and REST filter fallback when configured. No approval required.", schemas.list200);
register("prefect-cloud.flow_run.list", "READ: List/filter flow runs. Uses official MCP first and REST filter fallback when configured. No approval required.", schemas.list200);
register("prefect-cloud.flow_run.logs", "READ: Read bounded execution logs for one flow run. Uses official MCP first and REST log-filter fallback. No approval required.", schemas.logs);
register("prefect-cloud.task_run.list", "READ: List/filter task runs. Uses official MCP first and REST filter fallback when configured. No approval required.", schemas.list200);
register("prefect-cloud.work_pool.list", "READ: List/filter work pools and inspect worker infrastructure health. Uses official MCP first and REST fallback. No approval required.", schemas.list200);
register("prefect-cloud.event.read", "READ: Read bounded Prefect events for diagnostics. No approval required.", schemas.events);
register("prefect-cloud.automation.list", "READ: List/filter configured Prefect automations. No approval required.", schemas.automations);
register("prefect-cloud.rate_limit.review", "READ: Review Prefect Cloud API throttling periods and operation groups via the official MCP server. No approval required.", schemas.rateLimits);
register("prefect-cloud.deployment.run", "HIGH_RISK: Trigger a deployment flow run through the official Prefect REST API. Requires server-side enablement, exact confirmation, and explicit human approval token. The operation is never automatically retried.", schemas.deploymentRun);

const transport = new StdioServerTransport();
await server.connect(transport);

async function shutdown(): Promise<void> {
  await upstream.close();
  process.exit(0);
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
