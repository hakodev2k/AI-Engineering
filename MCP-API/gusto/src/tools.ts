import { z } from "zod";
import type { Risk } from "./policy.js";

const uuid = z.string().uuid();
const page = z.number().int().min(1).max(100000).optional();
const per = z.number().int().min(1).max(100).optional();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const input = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });

export interface ToolDef {
  name: string;
  purpose: string;
  scope: string;
  risk: Risk;
  approvalRequired: boolean;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
}

export const TOOLS: ToolDef[] = [
  {
    name: "gusto.company.get", purpose: "Get company metadata.", scope: "companies:read", risk: "READ", approvalRequired: false,
    schema: z.object({ companyId: uuid }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" } }, ["companyId"])
  },
  {
    name: "gusto.company.locations.list", purpose: "List company locations with bounded pagination.", scope: "companies:read", risk: "READ", approvalRequired: false,
    schema: z.object({ companyId: uuid, page, per }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 } }, ["companyId"])
  },
  {
    name: "gusto.employee.list", purpose: "List employees for a company with optional search and location/payroll filters.", scope: "employees:read", risk: "READ", approvalRequired: false,
    schema: z.object({ companyId: uuid, page, per, searchTerm: z.string().max(200).optional(), locationUuid: uuid.optional(), payrollUuid: uuid.optional(), sortBy: z.string().max(100).optional() }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 }, searchTerm: { type: "string", maxLength: 200 }, locationUuid: { type: "string", format: "uuid" }, payrollUuid: { type: "string", format: "uuid" }, sortBy: { type: "string", maxLength: 100 } }, ["companyId"])
  },
  {
    name: "gusto.employee.get", purpose: "Get a single employee, optionally including selected supported attributes.", scope: "employees:read", risk: "READ", approvalRequired: false,
    schema: z.object({ employeeId: uuid, include: z.array(z.enum(["all_compensations", "all_home_addresses", "company_name", "current_home_address", "custom_fields", "portal_invitations"])).max(6).optional() }).strict(),
    inputSchema: input({ employeeId: { type: "string", format: "uuid" }, include: { type: "array", maxItems: 6, items: { type: "string", enum: ["all_compensations", "all_home_addresses", "company_name", "current_home_address", "custom_fields", "portal_invitations"] } } }, ["employeeId"])
  },
  {
    name: "gusto.employee.home_addresses.list", purpose: "List an employee's home addresses.", scope: "employees:read", risk: "READ", approvalRequired: false,
    schema: z.object({ employeeId: uuid }).strict(),
    inputSchema: input({ employeeId: { type: "string", format: "uuid" } }, ["employeeId"])
  },
  {
    name: "gusto.employee.time_off_activities.list", purpose: "Get time-off activity for a specific employee and time-off type.", scope: "employee_time_off_activities:read", risk: "READ", approvalRequired: false,
    schema: z.object({ employeeId: uuid, timeOffType: z.string().min(1).max(100) }).strict(),
    inputSchema: input({ employeeId: { type: "string", format: "uuid" }, timeOffType: { type: "string", minLength: 1, maxLength: 100 } }, ["employeeId", "timeOffType"])
  },
  {
    name: "gusto.employee.pay_stubs.list", purpose: "List employee pay stubs with bounded pagination; does not download PDFs.", scope: "pay_stubs:read", risk: "READ", approvalRequired: false,
    schema: z.object({ employeeId: uuid, page, per }).strict(),
    inputSchema: input({ employeeId: { type: "string", format: "uuid" }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 } }, ["employeeId"])
  },
  {
    name: "gusto.payroll.list", purpose: "List company payrolls using supported filters and bounded pagination.", scope: "payrolls:read", risk: "READ", approvalRequired: false,
    schema: z.object({ companyId: uuid, page, per, processingStatuses: z.array(z.enum(["processed", "unprocessed"])).max(2).optional(), payrollTypes: z.array(z.string().min(1).max(50)).max(10).optional(), startDate: isoDate.optional(), endDate: isoDate.optional(), dateFilterBy: z.literal("check_date").optional(), sortOrder: z.enum(["asc", "desc"]).optional() }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 }, processingStatuses: { type: "array", maxItems: 2, items: { type: "string", enum: ["processed", "unprocessed"] } }, payrollTypes: { type: "array", maxItems: 10, items: { type: "string", maxLength: 50 } }, startDate: { type: "string", format: "date" }, endDate: { type: "string", format: "date" }, dateFilterBy: { type: "string", enum: ["check_date"] }, sortOrder: { type: "string", enum: ["asc", "desc"] } }, ["companyId"])
  },
  {
    name: "gusto.payroll.get", purpose: "Get one payroll, optionally including supported details.", scope: "payrolls:read", risk: "READ", approvalRequired: false,
    schema: z.object({ companyId: uuid, payrollId: uuid, page, per, include: z.array(z.string().min(1).max(50)).max(8).optional(), sortBy: z.string().max(100).optional() }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, payrollId: { type: "string", format: "uuid" }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 }, include: { type: "array", maxItems: 8, items: { type: "string", maxLength: 50 } }, sortBy: { type: "string", maxLength: 100 } }, ["companyId", "payrollId"])
  },
  {
    name: "gusto.employee.create", purpose: "Create an employee record. This changes HR data and requires explicit human approval.", scope: "employees:manage", risk: "HIGH_RISK", approvalRequired: true,
    schema: z.object({ companyId: uuid, firstName: z.string().min(1).max(100), lastName: z.string().min(1).max(100), email: z.string().email().nullable().optional(), workEmail: z.string().email().optional(), middleInitial: z.string().max(1).nullable().optional(), preferredFirstName: z.string().max(100).optional(), dateOfBirth: isoDate.optional(), ssn: z.string().regex(/^\d{9}$/).optional(), selfOnboarding: z.boolean().optional() }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, firstName: { type: "string", minLength: 1, maxLength: 100 }, lastName: { type: "string", minLength: 1, maxLength: 100 }, email: { anyOf: [{ type: "string", format: "email" }, { type: "null" }] }, workEmail: { type: "string", format: "email" }, middleInitial: { anyOf: [{ type: "string", maxLength: 1 }, { type: "null" }] }, preferredFirstName: { type: "string", maxLength: 100 }, dateOfBirth: { type: "string", format: "date" }, ssn: { type: "string", pattern: "^[0-9]{9}$" }, selfOnboarding: { type: "boolean" } }, ["companyId", "firstName", "lastName"])
  },
  {
    name: "gusto.employee.update", purpose: "Update selected employee identity/contact fields using optimistic versioning. Requires explicit human approval.", scope: "employees:write", risk: "HIGH_RISK", approvalRequired: true,
    schema: z.object({ employeeId: uuid, version: z.string().min(1).max(200), firstName: z.string().min(1).max(100).optional(), lastName: z.string().min(1).max(100).optional(), middleInitial: z.string().max(1).nullable().optional(), preferredFirstName: z.string().max(100).nullable().optional(), email: z.string().email().optional(), workEmail: z.string().email().optional(), dateOfBirth: isoDate.optional(), ssn: z.string().regex(/^\d{9}$/).optional(), twoPercentShareholder: z.boolean().optional() }).strict().refine((x) => Object.keys(x).some((k) => !["employeeId", "version"].includes(k)), "At least one mutable field is required."),
    inputSchema: input({ employeeId: { type: "string", format: "uuid" }, version: { type: "string", minLength: 1, maxLength: 200 }, firstName: { type: "string", minLength: 1, maxLength: 100 }, lastName: { type: "string", minLength: 1, maxLength: 100 }, middleInitial: { anyOf: [{ type: "string", maxLength: 1 }, { type: "null" }] }, preferredFirstName: { anyOf: [{ type: "string", maxLength: 100 }, { type: "null" }] }, email: { type: "string", format: "email" }, workEmail: { type: "string", format: "email" }, dateOfBirth: { type: "string", format: "date" }, ssn: { type: "string", pattern: "^[0-9]{9}$" }, twoPercentShareholder: { type: "boolean" } }, ["employeeId", "version"])
  },
  {
    name: "gusto.payroll.prepare", purpose: "Prepare an unprocessed payroll for update. This can invalidate prior calculations and requires explicit human approval.", scope: "payrolls:write employees:read", risk: "HIGH_RISK", approvalRequired: true,
    schema: z.object({ companyId: uuid, payrollId: uuid, employeeUuids: z.array(uuid).max(100).optional(), page, per }).strict(),
    inputSchema: input({ companyId: { type: "string", format: "uuid" }, payrollId: { type: "string", format: "uuid" }, employeeUuids: { type: "array", maxItems: 100, items: { type: "string", format: "uuid" } }, page: { type: "integer", minimum: 1 }, per: { type: "integer", minimum: 1, maximum: 100 } }, ["companyId", "payrollId"])
  }
];

export const TOOL_MAP = new Map(TOOLS.map((tool) => [tool.name, tool]));
