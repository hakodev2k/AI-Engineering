import type { Risk } from "./policy.js";

export type ToolMapping = {
  external: string;
  upstream: string;
  risk: Risk;
  description: string;
};

export const TOOL_MAPPINGS: ToolMapping[] = [
  { external: "bamboohr.employee.directory.read", upstream: "get_employees_directory", risk: "READ", description: "Read the published employee directory." },
  { external: "bamboohr.employee.get", upstream: "get_employee", risk: "READ", description: "Read one employee record subject to caller permissions." },
  { external: "bamboohr.employee.list", upstream: "list_employees", risk: "READ", description: "List, search, filter, or sort visible employees." },
  { external: "bamboohr.field.list", upstream: "list_fields", risk: "READ", description: "List employee fields including custom fields." },
  { external: "bamboohr.report.list", upstream: "list_reports", risk: "READ", description: "List saved reports visible to the caller." },
  { external: "bamboohr.report.run", upstream: "get_report_by_id", risk: "READ", description: "Run one saved BambooHR report." },
  { external: "bamboohr.time_off.whos_out.list", upstream: "list_whos_out", risk: "READ", description: "List people out and company holidays in a date range." },
  { external: "bamboohr.time_off.request.list", upstream: "list_time_off_requests", risk: "READ", description: "List visible time-off requests." },
  { external: "bamboohr.time_off.balance.get", upstream: "get_time_off_balance", risk: "READ", description: "Read an employee time-off balance subject to Time Off permission." },
  { external: "bamboohr.time_off.request.create", upstream: "create_time_off_request", risk: "WRITE", description: "Submit a time-off request through BambooHR's normal workflow." },
  { external: "bamboohr.goal.list", upstream: "list_goals", risk: "READ", description: "List goals for an employee." },
  { external: "bamboohr.goal.comment.create", upstream: "create_goal_comment", risk: "WRITE", description: "Add a comment to an employee goal." }
];

export const TOOL_BY_EXTERNAL = new Map(TOOL_MAPPINGS.map(t => [t.external, t]));
export const UPSTREAM_ALLOWLIST = new Set(TOOL_MAPPINGS.map(t => t.upstream));
