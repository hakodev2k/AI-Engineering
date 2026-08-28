import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "../auth/config.js";
import { DatabricksClient, DatabricksError } from "../client/databricks-client.js";
import { TOOL_DEFINITIONS, withoutApproval } from "../tools/definitions.js";
import { authorize } from "../tools/policy.js";

export function createServer({ config = loadConfig(), client = null } = {}) {
  const api = client || new DatabricksClient(config);
  const server = new Server(
    { name: "databricks-safe-connector", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFINITIONS }));

  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const name = request.params.name;
    const args = request.params.arguments || {};
    const payload = withoutApproval(args);

    try {
      authorize(config, name, payload, args.approval_token);
      const signal = extra?.signal;
      let result;

      switch (name) {
        case "databricks.cluster.list":
          result = await api.listClusters({ page_size: args.page_size ?? 20, page_token: args.page_token }, signal);
          break;
        case "databricks.cluster.get": result = await api.getCluster(payload, signal); break;
        case "databricks.cluster.start": result = await api.startCluster(payload, signal); break;
        case "databricks.cluster.restart": result = await api.restartCluster(payload, signal); break;
        case "databricks.cluster.terminate": result = await api.terminateCluster(payload, signal); break;
        case "databricks.job.list":
          result = await api.listJobs({ limit: args.limit ?? 20, page_token: args.page_token, name: args.name, expand_tasks: args.expand_tasks ?? false }, signal);
          break;
        case "databricks.job.get": result = await api.getJob(payload, signal); break;
        case "databricks.job.run.list":
          if (args.active_only && args.completed_only) throw new Error("active_only and completed_only are mutually exclusive");
          result = await api.listRuns({ job_id: args.job_id, active_only: args.active_only ?? false, completed_only: args.completed_only ?? false, limit: args.limit ?? 20, page_token: args.page_token }, signal);
          break;
        case "databricks.job.run.get": result = await api.getRun(payload, signal); break;
        case "databricks.job.run.start": result = await api.runJob(payload, signal); break;
        case "databricks.job.run.cancel": result = await api.cancelRun(payload, signal); break;
        case "databricks.warehouse.list": result = await api.listWarehouses({ page_size: args.page_size ?? 20, page_token: args.page_token }, signal); break;
        case "databricks.warehouse.get": result = await api.getWarehouse(payload, signal); break;
        case "databricks.warehouse.start": result = await api.startWarehouse(payload, signal); break;
        case "databricks.warehouse.stop": result = await api.stopWarehouse(payload, signal); break;
        case "databricks.sql.statement.execute":
          result = await api.executeStatement({
            warehouse_id: args.warehouse_id,
            statement: args.statement,
            catalog: args.catalog,
            schema: args.schema,
            row_limit: args.row_limit ?? 1000,
            byte_limit: args.byte_limit ?? 1048576,
            wait_timeout: args.wait_timeout ?? "10s",
            on_wait_timeout: args.on_wait_timeout ?? "CONTINUE",
            parameters: args.parameters
          }, signal);
          break;
        case "databricks.sql.statement.get": result = await api.getStatement(payload, signal); break;
        case "databricks.sql.statement.cancel": result = await api.cancelStatement(payload, signal); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{ type: "text", text: JSON.stringify({ untrusted_provider_data: true, data: result }, null, 2) }],
        structuredContent: { untrusted_provider_data: true, data: result }
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify({ error: normalizeError(error) }) }]
      };
    }
  });

  return server;
}

function normalizeError(error) {
  if (error instanceof DatabricksError) {
    if (error.status === 401 || error.status === 403) return { type: "AUTHORIZATION", status: error.status, code: error.code, message: error.message, retryable: false };
    if (error.status === 429) return { type: "RATE_LIMIT", status: error.status, code: error.code, message: error.message, retryAfter: error.retryAfter, retryable: true };
    return { type: "PROVIDER", status: error.status, code: error.code, message: error.message, retryable: [502, 503, 504].includes(error.status) };
  }
  return { type: "CONNECTOR", message: error?.message || String(error), retryable: false };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}
