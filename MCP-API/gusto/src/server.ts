import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { EnvCredentialProvider } from "./auth.js";
import { GustoApiError, GustoClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_MAP, TOOLS } from "./tools.js";

const config = loadConfig();
const credentials = new EnvCredentialProvider(config);
const client = new GustoClient(config, credentials);

function result(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

const enc = (value: unknown) => encodeURIComponent(String(value));
const comma = (value: unknown) => Array.isArray(value) ? value.join(",") : undefined;

function employeeCreateBody(args: Record<string, unknown>) {
  return {
    first_name: args.firstName,
    last_name: args.lastName,
    ...(args.email !== undefined ? { email: args.email } : {}),
    ...(args.workEmail !== undefined ? { work_email: args.workEmail } : {}),
    ...(args.middleInitial !== undefined ? { middle_initial: args.middleInitial } : {}),
    ...(args.preferredFirstName !== undefined ? { preferred_first_name: args.preferredFirstName } : {}),
    ...(args.dateOfBirth !== undefined ? { date_of_birth: args.dateOfBirth } : {}),
    ...(args.ssn !== undefined ? { ssn: args.ssn } : {}),
    ...(args.selfOnboarding !== undefined ? { self_onboarding: args.selfOnboarding } : {})
  };
}

function employeeUpdateBody(args: Record<string, unknown>) {
  return {
    version: args.version,
    ...(args.firstName !== undefined ? { first_name: args.firstName } : {}),
    ...(args.lastName !== undefined ? { last_name: args.lastName } : {}),
    ...(args.middleInitial !== undefined ? { middle_initial: args.middleInitial } : {}),
    ...(args.preferredFirstName !== undefined ? { preferred_first_name: args.preferredFirstName } : {}),
    ...(args.email !== undefined ? { email: args.email } : {}),
    ...(args.workEmail !== undefined ? { work_email: args.workEmail } : {}),
    ...(args.dateOfBirth !== undefined ? { date_of_birth: args.dateOfBirth } : {}),
    ...(args.ssn !== undefined ? { ssn: args.ssn } : {}),
    ...(args.twoPercentShareholder !== undefined ? { two_percent_shareholder: args.twoPercentShareholder } : {})
  };
}

async function dispatch(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "gusto.company.get":
      return client.request("GET", `/v1/companies/${enc(args.companyId)}`);
    case "gusto.company.locations.list":
      return client.request("GET", `/v1/companies/${enc(args.companyId)}/locations`, { query: { page: args.page as number | undefined, per: args.per as number | undefined } });
    case "gusto.employee.list":
      return client.request("GET", `/v1/companies/${enc(args.companyId)}/employees`, { query: {
        page: args.page as number | undefined,
        per: args.per as number | undefined,
        search_term: args.searchTerm as string | undefined,
        location_uuid: args.locationUuid as string | undefined,
        payroll_uuid: args.payrollUuid as string | undefined,
        sort_by: args.sortBy as string | undefined
      } });
    case "gusto.employee.get":
      return client.request("GET", `/v1/employees/${enc(args.employeeId)}`, { query: { include: comma(args.include) } });
    case "gusto.employee.home_addresses.list":
      return client.request("GET", `/v1/employees/${enc(args.employeeId)}/home_addresses`);
    case "gusto.employee.time_off_activities.list":
      return client.request("GET", `/v1/employees/${enc(args.employeeId)}/time_off_activities`, { query: { time_off_type: args.timeOffType as string } });
    case "gusto.employee.pay_stubs.list":
      return client.request("GET", `/v1/employees/${enc(args.employeeId)}/pay_stubs`, { query: { page: args.page as number | undefined, per: args.per as number | undefined } });
    case "gusto.payroll.list":
      return client.request("GET", `/v1/companies/${enc(args.companyId)}/payrolls`, { query: {
        page: args.page as number | undefined,
        per: args.per as number | undefined,
        processing_statuses: comma(args.processingStatuses),
        payroll_types: comma(args.payrollTypes),
        start_date: args.startDate as string | undefined,
        end_date: args.endDate as string | undefined,
        date_filter_by: args.dateFilterBy as string | undefined,
        sort_order: args.sortOrder as string | undefined
      } });
    case "gusto.payroll.get":
      return client.request("GET", `/v1/companies/${enc(args.companyId)}/payrolls/${enc(args.payrollId)}`, { query: {
        page: args.page as number | undefined,
        per: args.per as number | undefined,
        include: comma(args.include),
        sort_by: args.sortBy as string | undefined
      } });
    case "gusto.employee.create":
      return client.request("POST", `/v1/companies/${enc(args.companyId)}/employees`, { body: employeeCreateBody(args) });
    case "gusto.employee.update":
      return client.request("PUT", `/v1/employees/${enc(args.employeeId)}`, { body: employeeUpdateBody(args) });
    case "gusto.payroll.prepare":
      return client.request("PUT", `/v1/companies/${enc(args.companyId)}/payrolls/${enc(args.payrollId)}/prepare`, {
        query: { page: args.page as number | undefined, per: args.per as number | undefined },
        body: args.employeeUuids ? { employee_uuids: args.employeeUuids } : {}
      });
    default:
      throw new Error("Unknown Gusto tool.");
  }
}

export const server = new Server({ name: "gusto-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((tool) => ({
    name: tool.name,
    description: `${tool.purpose} Scope=${tool.scope}. Risk=${tool.risk}. Approval=${tool.approvalRequired}.`,
    inputSchema: tool.inputSchema as any
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  assertAllowed(tool.risk, tool.name, args, config);
  try {
    return result(await dispatch(tool.name, args));
  } catch (error) {
    if (error instanceof GustoApiError) {
      if (error.status === 401) throw new Error("Gusto authentication failed or expired. Re-authorize the company OAuth grant.");
      if (error.status === 403) throw new Error("Gusto denied this operation. Verify the company's OAuth grant and assigned API scopes.");
      if (error.status === 404) throw new Error("Gusto resource not found. Verify the supplied company/employee/payroll UUID.");
      if (error.status === 406) throw new Error("Gusto rejected the API version. This connector requires X-Gusto-API-Version 2026-06-15.");
      if (error.status === 409) throw new Error(`Gusto optimistic-version conflict: ${error.message}`);
      if (error.status === 422) throw new Error(`Gusto validation or invalid-operation error: ${error.message}`);
      if (error.status === 429) throw new Error(`Gusto rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter} seconds.` : ""}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
