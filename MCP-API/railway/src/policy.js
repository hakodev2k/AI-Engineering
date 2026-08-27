import crypto from "node:crypto";
import { approvalDigest } from "./config.js";

export const TOOL_MAP = Object.freeze({
  "railway.account.whoami":        { upstream: "whoami",             risk: "READ",      approval: false },
  "railway.workspace.list":        { upstream: "list_workspaces",    risk: "READ",      approval: false },
  "railway.project.list":          { upstream: "list_projects",      risk: "READ",      approval: false },
  "railway.project.create":        { upstream: "create_project",     risk: "WRITE",     approval: true  },
  "railway.service.list":          { upstream: "list_services",      risk: "READ",      approval: false },
  "railway.service.create":        { upstream: "create_service",     risk: "WRITE",     approval: true  },
  "railway.service.config.get":    { upstream: "get_service_config", risk: "READ",      approval: false },
  "railway.deployment.list":       { upstream: "list_deployments",   risk: "READ",      approval: false },
  "railway.deployment.deploy":     { upstream: "deploy",             risk: "HIGH_RISK", approval: true  },
  "railway.environment.status":    { upstream: "environment_status", risk: "READ",      approval: false },
  "railway.variable.list":         { upstream: "list_variables",     risk: "READ",      approval: false },
  "railway.variable.set":          { upstream: "set_variables",      risk: "HIGH_RISK", approval: true  },
  "railway.observability.logs":    { upstream: "get_logs",           risk: "READ",      approval: false },
  "railway.observability.metrics": { upstream: "service_metrics",    risk: "READ",      approval: false }
});

const BLOCKED_UPSTREAM_TOOLS = Object.freeze([
  "remove_service", "delete_domain", "remove_tcp_proxy", "remove_bucket",
  "remove_volume", "redeploy", "accept-deploy", "railway-agent",
  "private_network_update", "update_service", "scale_service",
  "create_tcp_proxy", "generate_domain", "update_domain",
  "retry_domain_certificate", "deploy_template"
]);

export function getBlockedUpstreamTools() {
  return [...BLOCKED_UPSTREAM_TOOLS];
}

export function authorize(config, externalTool, payload, approvalToken) {
  const policy = TOOL_MAP[externalTool];
  if (!policy) throw new Error(`Unknown tool: ${externalTool}`);

  if (policy.risk === "HIGH_RISK" && !config.enableHighRisk) {
    throw new Error(`${externalTool} is disabled; set RAILWAY_ENABLE_HIGH_RISK=true to enable high-risk operations`);
  }
  if (policy.risk === "DESTRUCTIVE" && !config.enableDestructive) {
    throw new Error(`${externalTool} is disabled; destructive operations require RAILWAY_ENABLE_DESTRUCTIVE=true`);
  }
  if (!policy.approval) return;

  if (!config.approvalSecret) throw new Error(`${externalTool} requires RAILWAY_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${externalTool} requires explicit approval_token`);

  const expected = approvalDigest(config.approvalSecret, externalTool, payload);
  const a = Buffer.from(approvalToken, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval_token for ${externalTool}`);
  }
}
