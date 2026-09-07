import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { StatsigApiError, StatsigClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new StatsigClient(config);
const enc = (value: unknown) => encodeURIComponent(String(value));
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });

function cleanBody(args: Record<string, unknown>, excluded: string[]) {
  return Object.fromEntries(Object.entries(args).filter(([key, value]) => !excluded.includes(key) && value !== undefined));
}

async function dispatch(toolName: string, args: Record<string, unknown>) {
  const pagination = { limit: args.limit as number | undefined, page: args.page as number | undefined };
  switch (toolName) {
    case "statsig.gate.list": return client.request("GET", "/console/v1/gates", undefined, { ...pagination, type: args.type as string | undefined });
    case "statsig.gate.get": return client.request("GET", `/console/v1/gates/${enc(args.gateId)}`);
    case "statsig.gate.create": return client.request("POST", "/console/v1/gates", cleanBody(args, ["approvalToken"]));
    case "statsig.gate.update": return client.request("PATCH", `/console/v1/gates/${enc(args.gateId)}`, cleanBody(args, ["gateId","approvalToken"]));
    case "statsig.experiment.list": return client.request("GET", "/console/v1/experiments", undefined, { ...pagination, status: args.status as string | undefined, stale: args.stale as boolean | undefined });
    case "statsig.experiment.get": return client.request("GET", `/console/v1/experiments/${enc(args.experimentId)}`);
    case "statsig.dynamic_config.list": return client.request("GET", "/console/v1/dynamic_configs", undefined, { ...pagination, type: args.type as string | undefined });
    case "statsig.dynamic_config.get": return client.request("GET", `/console/v1/dynamic_configs/${enc(args.configId)}`);
    case "statsig.dynamic_config.create": return client.request("POST", "/console/v1/dynamic_configs", cleanBody(args, ["approvalToken"]));
    case "statsig.dynamic_config.update": return client.request("PATCH", `/console/v1/dynamic_configs/${enc(args.configId)}`, cleanBody(args, ["configId","approvalToken"]));
    case "statsig.metric.list": return client.request("GET", "/console/v1/metrics/list", undefined, { limit: args.limit as number | undefined, page: args.page as number | undefined, showHiddenMetrics: args.showHiddenMetrics as boolean | undefined, filters: args.filters as string | undefined });
    case "statsig.metric_value.list": return client.request("GET", "/console/v1/metrics/values", undefined, { date: String(args.date), limit: args.limit as number | undefined, page: args.page as number | undefined, metricName: args.metricName as string | undefined, metricType: args.metricType as string | undefined });
    default: throw new Error("Unknown Statsig tool.");
  }
}

export const server = new Server({ name: "statsig-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(tool => ({ name: tool.name, description: `${tool.description} Risk=${tool.risk}.`, inputSchema: tool.inputSchema as any }))
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof StatsigApiError) {
      if (error.status === 401) throw new Error("Statsig authentication failed. Verify an active Console API key.");
      if (error.status === 403) throw new Error("Statsig denied the operation. Verify key/role permissions.");
      if (error.status === 404) throw new Error("Statsig resource was not found.");
      if (error.status === 429) throw new Error(`Statsig rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
      if (error.status >= 400 && error.status < 500) throw new Error(`Statsig validation/request error: ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
