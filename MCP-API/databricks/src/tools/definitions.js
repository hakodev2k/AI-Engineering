const ID = { type: "string", minLength: 1, maxLength: 256 };
const PAGE_TOKEN = { type: "string", minLength: 1, maxLength: 4096 };
const APPROVAL = { type: "string", minLength: 64, maxLength: 64, pattern: "^[a-f0-9]{64}$" };
const INT64 = { type: "integer", minimum: 1 };

export const TOOL_DEFINITIONS = [
  {
    name: "databricks.cluster.list",
    description: "List compute clusters with bounded pagination. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, properties: { page_size: { type: "integer", minimum: 1, maximum: 100, default: 20 }, page_token: PAGE_TOKEN } }
  },
  {
    name: "databricks.cluster.get",
    description: "Get one compute cluster by ID. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, required: ["cluster_id"], properties: { cluster_id: ID } }
  },
  {
    name: "databricks.cluster.start",
    description: "Start a terminated cluster. Risk: HIGH_RISK because it consumes compute. Explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["cluster_id", "approval_token"], properties: { cluster_id: ID, approval_token: APPROVAL } }
  },
  {
    name: "databricks.cluster.restart",
    description: "Restart a running cluster. Risk: HIGH_RISK because workloads can be interrupted. Explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["cluster_id", "approval_token"], properties: { cluster_id: ID, approval_token: APPROVAL } }
  },
  {
    name: "databricks.cluster.terminate",
    description: "Terminate a cluster using the Databricks clusters/delete operation. Risk: DESTRUCTIVE. Disabled by default and explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["cluster_id", "approval_token"], properties: { cluster_id: ID, approval_token: APPROVAL } }
  },
  {
    name: "databricks.job.list",
    description: "List jobs using Jobs API 2.2. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, properties: { limit: { type: "integer", minimum: 1, maximum: 100, default: 20 }, page_token: PAGE_TOKEN, name: { type: "string", minLength: 1, maxLength: 4096 }, expand_tasks: { type: "boolean", default: false } } }
  },
  {
    name: "databricks.job.get",
    description: "Get one job. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, required: ["job_id"], properties: { job_id: INT64, page_token: PAGE_TOKEN, include_trigger_state: { type: "boolean", default: false } } }
  },
  {
    name: "databricks.job.run.list",
    description: "List job runs with bounded pagination. active_only and completed_only are mutually exclusive. Risk: READ.",
    inputSchema: { type: "object", additionalProperties: false, properties: { job_id: INT64, active_only: { type: "boolean", default: false }, completed_only: { type: "boolean", default: false }, limit: { type: "integer", minimum: 1, maximum: 25, default: 20 }, page_token: PAGE_TOKEN } }
  },
  {
    name: "databricks.job.run.get",
    description: "Get one job run. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, required: ["run_id"], properties: { run_id: INT64, page_token: PAGE_TOKEN } }
  },
  {
    name: "databricks.job.run.start",
    description: "Start a job run using Jobs API 2.2 run-now. Risk: HIGH_RISK. Explicit approval required. Supply idempotency_token for safe retry semantics.",
    inputSchema: { type: "object", additionalProperties: false, required: ["job_id", "approval_token"], properties: { job_id: INT64, job_parameters: { type: "object", maxProperties: 100, additionalProperties: { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }, { type: "null" }] } }, idempotency_token: { type: "string", minLength: 1, maxLength: 64 }, approval_token: APPROVAL } }
  },
  {
    name: "databricks.job.run.cancel",
    description: "Cancel a job run. Risk: HIGH_RISK. Disabled by default and explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["run_id", "approval_token"], properties: { run_id: INT64, approval_token: APPROVAL } }
  },
  {
    name: "databricks.warehouse.list",
    description: "List SQL warehouses. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, properties: { page_size: { type: "integer", minimum: 1, maximum: 100, default: 20 }, page_token: PAGE_TOKEN } }
  },
  {
    name: "databricks.warehouse.get",
    description: "Get one SQL warehouse. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, required: ["warehouse_id"], properties: { warehouse_id: ID } }
  },
  {
    name: "databricks.warehouse.start",
    description: "Start a SQL warehouse. Risk: HIGH_RISK because it consumes compute. Explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["warehouse_id", "approval_token"], properties: { warehouse_id: ID, approval_token: APPROVAL } }
  },
  {
    name: "databricks.warehouse.stop",
    description: "Stop a SQL warehouse. Risk: HIGH_RISK because active work can be affected. Explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["warehouse_id", "approval_token"], properties: { warehouse_id: ID, approval_token: APPROVAL } }
  },
  {
    name: "databricks.sql.statement.execute",
    description: "Execute a parameterized SQL statement through Statement Execution API. Always HIGH_RISK and approval-gated; results are INLINE JSON only with bounded rows/bytes.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["warehouse_id", "statement", "approval_token"],
      properties: {
        warehouse_id: ID,
        statement: { type: "string", minLength: 1, maxLength: 1048576 },
        catalog: { type: "string", minLength: 1, maxLength: 255 },
        schema: { type: "string", minLength: 1, maxLength: 255 },
        row_limit: { type: "integer", minimum: 1, maximum: 10000, default: 1000 },
        byte_limit: { type: "integer", minimum: 1, maximum: 10485760, default: 1048576 },
        wait_timeout: { type: "string", pattern: "^(0|[5-9]|[1-4][0-9]|50)s$", default: "10s" },
        on_wait_timeout: { enum: ["CONTINUE", "CANCEL"], default: "CONTINUE" },
        parameters: { type: "array", maxItems: 100, items: { type: "object", additionalProperties: false, required: ["name", "value"], properties: { name: { type: "string", minLength: 1, maxLength: 255 }, value: { oneOf: [{ type: "string", maxLength: 1048576 }, { type: "null" }] }, type: { type: "string", minLength: 1, maxLength: 255 } } } },
        approval_token: APPROVAL
      }
    }
  },
  {
    name: "databricks.sql.statement.get",
    description: "Get statement status and inline result metadata. Risk: READ. Approval: none.",
    inputSchema: { type: "object", additionalProperties: false, required: ["statement_id"], properties: { statement_id: ID } }
  },
  {
    name: "databricks.sql.statement.cancel",
    description: "Cancel a running SQL statement. Risk: HIGH_RISK. Disabled by default and explicit approval required.",
    inputSchema: { type: "object", additionalProperties: false, required: ["statement_id", "approval_token"], properties: { statement_id: ID, approval_token: APPROVAL } }
  }
];

export function withoutApproval(args = {}) {
  const { approval_token: _approval, ...payload } = args;
  return payload;
}
