import type { Permission } from "./config.js";

export interface ToolBinding {
  publicName: string;
  upstreamName: string;
  permission: Permission;
  description: string;
  approval?: "APPROVE_WRITE" | "APPROVE_HIGH_RISK" | "APPROVE_DESTRUCTIVE";
}

export const TOOL_BINDINGS: readonly ToolBinding[] = [
  { publicName:"raygun.application.list", upstreamName:"applications_list", permission:"read", description:"List Raygun applications available to the authenticated plan." },
  { publicName:"raygun.application.search", upstreamName:"applications_search", permission:"read", description:"Find Raygun applications by name." },
  { publicName:"raygun.error_group.list", upstreamName:"error_groups_list", permission:"read", description:"List Crash Reporting error groups for an application." },
  { publicName:"raygun.error_group.search", upstreamName:"error_groups_search", permission:"read", description:"Search indexed Crash Reporting occurrences and error groups." },
  { publicName:"raygun.error_group.investigate", upstreamName:"error_group_investigate", permission:"read", description:"Inspect an error group and its latest occurrence and request context." },
  { publicName:"raygun.error_instance.list", upstreamName:"error_group_instances_list", permission:"read", description:"List occurrence identifiers and timestamps for an error group." },
  { publicName:"raygun.error_instance.get", upstreamName:"error_instance_get", permission:"read", description:"Get full typed details for a Crash Reporting occurrence." },
  { publicName:"raygun.error_comment.list", upstreamName:"error_group_read_comments", permission:"read", description:"Read investigation comments for an error group." },
  { publicName:"raygun.error_group.status.update", upstreamName:"error_group_update_status", permission:"write", approval:"APPROVE_WRITE", description:"Change an error group's status, such as active, resolved, ignored, or permanently ignored." },
  { publicName:"raygun.error_group.comment.add", upstreamName:"error_group_add_comment", permission:"write", approval:"APPROVE_WRITE", description:"Add an investigation or collaboration comment to an error group." },
  { publicName:"raygun.apm.issue.search", upstreamName:"apm_issues_search", permission:"read", description:"Search recurring APM performance issues and anti-patterns." },
  { publicName:"raygun.apm.issue.investigate", upstreamName:"apm_issue_investigate", permission:"read", description:"Inspect an APM issue, percentiles, metrics, and recent traces." },
  { publicName:"raygun.apm.trace.search", upstreamName:"apm_traces_search", permission:"read", description:"Search APM traces by time, request text, duration, or status code." },
  { publicName:"raygun.apm.trace.investigate", upstreamName:"apm_trace_investigate", permission:"read", description:"Inspect an APM trace and its significant calls." },
  { publicName:"raygun.apm.hotspot.search", upstreamName:"apm_hotspots_search", permission:"read", description:"Rank slow methods, database queries, or external calls." },
  { publicName:"raygun.deployment.list", upstreamName:"deployments_list", permission:"read", description:"Browse deployment history for an application." },
  { publicName:"raygun.deployment.latest", upstreamName:"deployment_get_latest", permission:"read", description:"Get the latest deployment and related error groups." },
  { publicName:"raygun.deployment.investigate", upstreamName:"deployment_investigate", permission:"read", description:"Inspect a deployment and errors associated with its release." },
  { publicName:"raygun.deployment.create", upstreamName:"deployment_create", permission:"write", approval:"APPROVE_WRITE", description:"Record a deployment in Raygun." },
  { publicName:"raygun.customer.search", upstreamName:"customers_search", permission:"read", description:"Find affected customers by name, email, or external identifier." },
  { publicName:"raygun.customer.investigate", upstreamName:"customer_investigate", permission:"read", description:"Inspect a customer profile, recent errors, and recent sessions." },
  { publicName:"raygun.session.list", upstreamName:"sessions_list", permission:"read", description:"List RUM sessions and environment metadata." },
  { publicName:"raygun.session.investigate", upstreamName:"session_investigate", permission:"read", description:"Inspect a RUM session's environment, errors, and page journey." },
  { publicName:"raygun.metric.error_trends.analyze", upstreamName:"metrics_error_trends_analyze", permission:"read", description:"Analyze error counts, affected users, and affected sessions over time." }
] as const;

export const TOOL_BY_PUBLIC = new Map(TOOL_BINDINGS.map(x => [x.publicName, x]));
