import type { Risk } from "./policy.js";

export type ToolRoute = {
  external: string;
  upstream: string;
  risk: Risk;
  purpose: string;
};

export const TOOL_ROUTES: readonly ToolRoute[] = [
  { external: "aiven.project.list", upstream: "aiven_project_list", risk: "READ", purpose: "List Aiven projects visible to the authenticated principal." },
  { external: "aiven.project.get", upstream: "aiven_project_get", risk: "READ", purpose: "Read details for an Aiven project." },
  { external: "aiven.cloud.list", upstream: "aiven_list_project_clouds", risk: "READ", purpose: "List available cloud regions for a project." },
  { external: "aiven.service.list", upstream: "aiven_service_list", risk: "READ", purpose: "List services in an Aiven project." },
  { external: "aiven.service.get", upstream: "aiven_service_get", risk: "READ", purpose: "Read service status, plan, region, and configuration metadata." },
  { external: "aiven.service.plans.list", upstream: "aiven_service_type_plans", risk: "READ", purpose: "List plans and cloud availability for an Aiven service type." },
  { external: "aiven.service.pricing.get", upstream: "aiven_service_plan_pricing", risk: "READ", purpose: "Read pricing for a service plan in a cloud region." },
  { external: "aiven.service.metrics.get", upstream: "aiven_service_metrics_fetch", risk: "READ", purpose: "Fetch managed-service metrics for diagnostics and health checks." },
  { external: "aiven.service.logs.list", upstream: "aiven_project_get_service_logs", risk: "READ", purpose: "Read recent service logs for troubleshooting." },
  { external: "aiven.service.query_activity.list", upstream: "aiven_service_query_activity", risk: "READ", purpose: "Inspect current query activity for supported services." },
  { external: "aiven.project.events.list", upstream: "aiven_project_get_event_logs", risk: "READ", purpose: "Read project event log entries." },
  { external: "aiven.service.create", upstream: "aiven_service_create", risk: "WRITE", purpose: "Create an Aiven managed service. Human approval is required." },
  { external: "aiven.service.update", upstream: "aiven_service_update", risk: "HIGH_RISK", purpose: "Change service plan, configuration, or power state. Explicit human approval is required." }
] as const;

export const ROUTE_BY_EXTERNAL = new Map(TOOL_ROUTES.map((r) => [r.external, r]));
