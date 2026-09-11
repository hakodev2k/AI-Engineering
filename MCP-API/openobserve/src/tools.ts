import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { ConnectorConfig } from "./config.js";
import { assertKnownReadTool } from "./policy.js";
import { OpenObserveRestClient, queryString } from "./rest.js";
import { OpenObserveMcpClient } from "./upstream.js";

export type ToolDeps = {
  config: ConnectorConfig;
  rest: OpenObserveRestClient;
  upstream: OpenObserveMcpClient;
};

const streamType = z.enum(["logs", "metrics", "traces"]);
const microseconds = z.number().int().nonnegative();

function toolResult(source: "mcp" | "rest", data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ source, data }) }] };
}

async function preferMcp(
  deps: ToolDeps,
  upstreamTool: string,
  upstreamArgs: Record<string, unknown>,
  fallback: () => Promise<unknown>
) {
  try {
    return toolResult("mcp", await deps.upstream.callTool(upstreamTool, upstreamArgs));
  } catch (error) {
    if (!deps.config.allowRestFallback) throw error;
    return toolResult("rest", await fallback());
  }
}

export function registerTools(server: McpServer, deps: ToolDeps): void {
  server.tool(
    "openobserve.stream.list",
    "List OpenObserve streams. READ. Uses official OpenObserve MCP StreamList first, then the official REST API if MCP is unavailable.",
    { type: streamType.default("logs"), fetchSchema: z.boolean().default(false) },
    async ({ type, fetchSchema }) => {
      assertKnownReadTool("openobserve.stream.list");
      return preferMcp(deps, "StreamList", { org_id: deps.config.orgId, type, fetch_schema: fetchSchema }, () =>
        deps.rest.get(deps.rest.orgPath(`/streams?${queryString({ type, fetchSchema })}`))
      );
    }
  );

  server.tool(
    "openobserve.stream.schema",
    "Read schema, statistics, and settings for one OpenObserve stream. READ.",
    { stream: z.string().min(1).max(256), type: streamType.default("logs") },
    async ({ stream, type }) => {
      assertKnownReadTool("openobserve.stream.schema");
      return preferMcp(deps, "StreamSchema", { org_id: deps.config.orgId, stream_name: stream, stream_type: type }, () =>
        deps.rest.get(deps.rest.orgPath(`/streams/${encodeURIComponent(stream)}/schema?${queryString({ type })}`))
      );
    }
  );

  server.tool(
    "openobserve.search.sql",
    "Run a bounded SQL telemetry search. READ. start_time and end_time are epoch microseconds. Result size is capped at 1000.",
    {
      sql: z.string().min(1).max(20000),
      start_time: microseconds,
      end_time: microseconds,
      from: z.number().int().min(0).max(1_000_000).default(0),
      size: z.number().int().min(1).max(1000).default(100),
      output_format: z.enum(["json", "csv", "md_table"]).default("json"),
      partition_mode: z.boolean().default(true)
    },
    async (input) => {
      assertKnownReadTool("openobserve.search.sql");
      if (input.start_time >= input.end_time) throw new Error("start_time must be less than end_time");
      const request_body = {
        query: { sql: input.sql, start_time: input.start_time, end_time: input.end_time, from: input.from, size: input.size },
        agent_options: { mode: input.partition_mode ? "partition" : "default", output_format: input.output_format }
      };
      return preferMcp(deps, "SearchSQL", { org_id: deps.config.orgId, request_body, detail: input.output_format === "json" ? "summary" : "full" }, () =>
        deps.rest.post(deps.rest.orgPath("/_search"), request_body)
      );
    }
  );

  server.tool(
    "openobserve.search.values",
    "Return distinct values for one or more fields in a stream within a bounded time range. READ.",
    {
      stream: z.string().min(1).max(256),
      fields: z.array(z.string().min(1).max(256)).min(1).max(20),
      start_time: microseconds,
      end_time: microseconds,
      size: z.number().int().min(1).max(100).default(10),
      keyword: z.string().max(500).optional(),
      no_count: z.boolean().default(false)
    },
    async (input) => {
      assertKnownReadTool("openobserve.search.values");
      if (input.start_time >= input.end_time) throw new Error("start_time must be less than end_time");
      const qs = queryString({ fields: input.fields.join(","), start_time: input.start_time, end_time: input.end_time, size: input.size, keyword: input.keyword, no_count: input.no_count });
      return toolResult("rest", await deps.rest.get(deps.rest.orgPath(`/${encodeURIComponent(input.stream)}/_values?${qs}`)));
    }
  );

  server.tool(
    "openobserve.trace.latest",
    "List recent trace summaries from an OpenObserve trace stream. READ.",
    {
      stream: z.string().min(1).max(256),
      start_time: microseconds,
      end_time: microseconds,
      from: z.number().int().min(0).max(1_000_000).default(0),
      size: z.number().int().min(1).max(200).default(50),
      filter: z.string().max(2000).optional()
    },
    async (input) => {
      assertKnownReadTool("openobserve.trace.latest");
      if (input.start_time >= input.end_time) throw new Error("start_time must be less than end_time");
      return preferMcp(deps, "GetLatestTraces", {
        org_id: deps.config.orgId, stream_name: input.stream, start_time: input.start_time, end_time: input.end_time,
        from: input.from, size: input.size, filter: input.filter
      }, () => {
        const qs = queryString({ start_time: input.start_time, end_time: input.end_time, from: input.from, size: input.size, filter: input.filter });
        return deps.rest.get(deps.rest.orgPath(`/${encodeURIComponent(input.stream)}/traces/latest?${qs}`));
      });
    }
  );

  server.tool(
    "openobserve.metrics.range_query",
    "Execute a PromQL range query. READ. Times use Prometheus-compatible seconds or RFC3339 strings.",
    {
      query: z.string().min(1).max(10000),
      start: z.union([z.string().min(1).max(64), z.number().finite()]),
      end: z.union([z.string().min(1).max(64), z.number().finite()]),
      step: z.union([z.string().min(1).max(32), z.number().positive()])
    },
    async (input) => {
      assertKnownReadTool("openobserve.metrics.range_query");
      return preferMcp(deps, "PrometheusRangeQuery", { org_id: deps.config.orgId, query: input.query, start: input.start, end: input.end, step: input.step }, () => {
        const qs = queryString({ query: input.query, start: input.start as string | number, end: input.end as string | number, step: input.step as string | number });
        return deps.rest.get(deps.rest.orgPath(`/prometheus/api/v1/query_range?${qs}`));
      });
    }
  );

  server.tool(
    "openobserve.search.profile",
    "Read OpenObserve Search Inspector profiling metadata for recent searches. READ.",
    {},
    async () => {
      assertKnownReadTool("openobserve.search.profile");
      return toolResult("rest", await deps.rest.get(deps.rest.orgPath("/search/profile")));
    }
  );

  server.tool(
    "openobserve.cluster.info",
    "Read operational OpenObserve cluster information such as pending compaction jobs. READ.",
    {},
    async () => {
      assertKnownReadTool("openobserve.cluster.info");
      return toolResult("rest", await deps.rest.get(deps.rest.orgPath("/cluster_info")));
    }
  );
}
