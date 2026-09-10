import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig, type ConnectorConfig } from "./config.js";
import { CockroachCloudClient } from "./client.js";
import { enforcePolicy, TOOL_RISK } from "./policy.js";

const clusterId = z.string().uuid();
const username = z.string().min(1).max(128).regex(/^[A-Za-z_][A-Za-z0-9_.@-]*$/);
const page = z.number().int().min(1).max(100000).default(1);
const limit = z.number().int().min(1).max(100).default(50);
const approvalId = z.string().regex(/^[a-f0-9]{64}$/i);

export const TOOL_NAMES = [
  "cockroachdb_cloud.cluster.list",
  "cockroachdb_cloud.cluster.get",
  "cockroachdb_cloud.cluster.nodes.list",
  "cockroachdb_cloud.cluster.connection_string.get",
  "cockroachdb_cloud.cluster.version.list",
  "cockroachdb_cloud.database.list",
  "cockroachdb_cloud.sql_user.list",
  "cockroachdb_cloud.cluster.delete",
  "cockroachdb_cloud.sql_user.delete"
] as const;

const json = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify({ untrusted_provider_content: true, data: value }) }]
});

const failure = (tool: string, error: unknown) => ({
  isError: true,
  content: [{ type: "text" as const, text: JSON.stringify({ tool, error: error instanceof Error ? error.message : String(error) }) }]
});

export function buildServer(config: ConnectorConfig, client: CockroachCloudClient = new CockroachCloudClient(config)): McpServer {
  const server = new McpServer({ name: "cockroachdb-cloud-safe-connector", version: "1.0.0" });

  const safe = <T extends Record<string, unknown>>(tool: string, fn: (args: T) => Promise<unknown>) => async (args: T) => {
    try {
      enforcePolicy(tool, args, config);
      return json(await fn(args));
    } catch (error) {
      return failure(tool, error);
    }
  };

  server.tool(
    "cockroachdb_cloud.cluster.list",
    `List CockroachDB Cloud clusters. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.list"]}; approval=not-required.`,
    { page, limit },
    safe("cockroachdb_cloud.cluster.list", async ({ page, limit }) => client.request("GET", "/clusters", { query: { page: page as number, limit: limit as number } }))
  );

  server.tool(
    "cockroachdb_cloud.cluster.get",
    `Get one CockroachDB Cloud cluster. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.get"]}; approval=not-required.`,
    { clusterId },
    safe("cockroachdb_cloud.cluster.get", async ({ clusterId }) => client.request("GET", `/clusters/${encodeURIComponent(clusterId as string)}`))
  );

  server.tool(
    "cockroachdb_cloud.cluster.nodes.list",
    `List nodes for one cluster. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.nodes.list"]}; approval=not-required.`,
    { clusterId },
    safe("cockroachdb_cloud.cluster.nodes.list", async ({ clusterId }) => client.request("GET", `/clusters/${encodeURIComponent(clusterId as string)}/nodes`))
  );

  server.tool(
    "cockroachdb_cloud.cluster.connection_string.get",
    `Get a formatted cluster connection string without a SQL password. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.connection_string.get"]}; approval=not-required.`,
    { clusterId, database: z.string().min(1).max(128).optional(), sqlUser: username.optional(), os: z.enum(["MAC", "LINUX", "WINDOWS"]).optional() },
    safe("cockroachdb_cloud.cluster.connection_string.get", async ({ clusterId, database, sqlUser, os }) => client.request("GET", `/clusters/${encodeURIComponent(clusterId as string)}/connection-string`, { query: { database: database as string | undefined, sql_user: sqlUser as string | undefined, os: os as string | undefined } }))
  );

  server.tool(
    "cockroachdb_cloud.cluster.version.list",
    `List available major cluster versions. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.version.list"]}; approval=not-required.`,
    { page, limit },
    safe("cockroachdb_cloud.cluster.version.list", async ({ page, limit }) => client.request("GET", "/cluster-versions", { query: { page: page as number, limit: limit as number } }))
  );

  server.tool(
    "cockroachdb_cloud.database.list",
    `List databases for a cluster. Permission=${TOOL_RISK["cockroachdb_cloud.database.list"]}; approval=not-required.`,
    { clusterId, page, limit },
    safe("cockroachdb_cloud.database.list", async ({ clusterId, page, limit }) => client.request("GET", `/clusters/${encodeURIComponent(clusterId as string)}/databases`, { query: { page: page as number, limit: limit as number } }))
  );

  server.tool(
    "cockroachdb_cloud.sql_user.list",
    `List SQL users for a cluster. Permission=${TOOL_RISK["cockroachdb_cloud.sql_user.list"]}; approval=not-required.`,
    { clusterId, page, limit },
    safe("cockroachdb_cloud.sql_user.list", async ({ clusterId, page, limit }) => client.request("GET", `/clusters/${encodeURIComponent(clusterId as string)}/sql-users`, { query: { page: page as number, limit: limit as number } }))
  );

  server.tool(
    "cockroachdb_cloud.cluster.delete",
    `Permanently delete a cluster. Permission=${TOOL_RISK["cockroachdb_cloud.cluster.delete"]}; approval=required; destructive-disabled-by-default.`,
    { clusterId, confirmClusterId: clusterId, approvalId },
    safe("cockroachdb_cloud.cluster.delete", async ({ clusterId, confirmClusterId }) => {
      if (clusterId !== confirmClusterId) throw new Error("confirmClusterId must exactly match clusterId");
      return client.request("DELETE", `/clusters/${encodeURIComponent(clusterId as string)}`, { retryable: false });
    })
  );

  server.tool(
    "cockroachdb_cloud.sql_user.delete",
    `Delete a SQL user. Permission=${TOOL_RISK["cockroachdb_cloud.sql_user.delete"]}; approval=required; destructive-disabled-by-default.`,
    { clusterId, username, confirmUsername: username, approvalId },
    safe("cockroachdb_cloud.sql_user.delete", async ({ clusterId, username, confirmUsername }) => {
      if (username !== confirmUsername) throw new Error("confirmUsername must exactly match username");
      return client.request("DELETE", `/clusters/${encodeURIComponent(clusterId as string)}/sql-users/${encodeURIComponent(username as string)}`, { retryable: false });
    })
  );

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig();
  const server = buildServer(config);
  await server.connect(new StdioServerTransport());
}
