import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { CopperConfig } from "./config.js";
import { CopperClient } from "./client.js";
import { requireApproval, type Risk } from "./policy.js";

const id = z.number().int().positive();
const pageSize = z.number().int().min(1).max(200).optional();
const pageNumber = z.number().int().min(1).optional();
const text = z.string().min(1).max(1000);
const email = z.string().email().max(320);
const tags = z.array(z.string().min(1).max(100)).max(100).optional();
const approval = z.enum(["approved", "approved-high-risk"]).optional();

export interface ToolSpec { name: string; risk: Risk; description: string; }
export const TOOL_SPECS: ToolSpec[] = [
  { name: "copper.person.search", risk: "READ", description: "Search Copper people using common supported filters." },
  { name: "copper.person.get", risk: "READ", description: "Get a Copper person by ID." },
  { name: "copper.person.create", risk: "WRITE", description: "Create a Copper person." },
  { name: "copper.person.update", risk: "WRITE", description: "Update supported fields on a Copper person." },
  { name: "copper.company.search", risk: "READ", description: "Search Copper companies." },
  { name: "copper.company.get", risk: "READ", description: "Get a Copper company by ID." },
  { name: "copper.company.create", risk: "WRITE", description: "Create a Copper company." },
  { name: "copper.company.update", risk: "WRITE", description: "Update supported fields on a Copper company." },
  { name: "copper.opportunity.search", risk: "READ", description: "Search Copper opportunities." },
  { name: "copper.opportunity.get", risk: "READ", description: "Get a Copper opportunity by ID." },
  { name: "copper.opportunity.create", risk: "WRITE", description: "Create a Copper opportunity." },
  { name: "copper.opportunity.update", risk: "WRITE", description: "Update supported fields on a Copper opportunity." },
  { name: "copper.project.search", risk: "READ", description: "Search Copper projects." },
  { name: "copper.project.get", risk: "READ", description: "Get a Copper project by ID." },
  { name: "copper.activity.search", risk: "READ", description: "Search Copper activities." },
  { name: "copper.activity.create", risk: "WRITE", description: "Create an activity on a supported parent entity." },
  { name: "copper.custom_field.list", risk: "READ", description: "List account custom field definitions." },
  { name: "copper.pipeline.list", risk: "READ", description: "List Copper pipelines and stages." }
];

const personFields = {
  name: z.string().min(1).max(255).optional(),
  emails: z.array(z.object({ email, category: z.string().max(100).optional() }).strict()).max(20).optional(),
  phone_numbers: z.array(z.object({ number: z.string().min(1).max(100), category: z.string().max(100).optional() }).strict()).max(20).optional(),
  company_id: id.optional(), assignee_id: id.optional(), contact_type_id: id.optional(), tags
};
const companyFields = {
  name: z.string().min(1).max(255).optional(),
  email_domain: z.string().min(1).max(253).optional(),
  phone_numbers: z.array(z.object({ number: z.string().min(1).max(100), category: z.string().max(100).optional() }).strict()).max(20).optional(),
  assignee_id: id.optional(), contact_type_id: id.optional(), tags
};
const opportunityFields = {
  name: z.string().min(1).max(255).optional(),
  company_id: id.optional(), primary_contact_id: id.optional(), assignee_id: id.optional(),
  pipeline_id: id.optional(), pipeline_stage_id: id.optional(), customer_source_id: id.optional(),
  monetary_value: z.number().finite().min(0).optional(), priority: z.string().max(100).optional(), tags
};

function safe(value: unknown): string {
  const json = JSON.stringify(value, null, 2);
  return json.length > 500_000 ? `${json.slice(0, 500_000)}\n...[truncated]` : json;
}
function result(name: string, risk: Risk, value: unknown) {
  return { content: [{ type: "text" as const, text: safe({ provider: "Copper", tool: name, risk, untrusted_provider_content: true, result: value }) }] };
}

export function registerTools(server: McpServer, client: CopperClient, config: CopperConfig): void {
  server.tool("copper.person.search", TOOL_SPECS[0].description, {
    name: z.string().max(255).optional(), email: z.string().max(320).optional(), company_ids: z.array(id).max(100).optional(), assignee_ids: z.array(id).max(100).optional(), page_size: pageSize, page_number: pageNumber
  }, async (args) => result("copper.person.search", "READ", await client.post("people/search", args)));

  server.tool("copper.person.get", TOOL_SPECS[1].description, { person_id: id }, async ({ person_id }) => result("copper.person.get", "READ", await client.get(`people/${person_id}`)));

  server.tool("copper.person.create", TOOL_SPECS[2].description, { ...personFields, name: z.string().min(1).max(255), approval }, async ({ approval: a, ...body }) => {
    requireApproval("WRITE", a, config); return result("copper.person.create", "WRITE", await client.post("people", body, false));
  });

  server.tool("copper.person.update", TOOL_SPECS[3].description, { person_id: id, ...personFields, approval }, async ({ person_id, approval: a, ...body }) => {
    requireApproval("WRITE", a, config); if (Object.keys(body).length === 0) throw new Error("At least one field is required"); return result("copper.person.update", "WRITE", await client.put(`people/${person_id}`, body));
  });

  server.tool("copper.company.search", TOOL_SPECS[4].description, {
    name: z.string().max(255).optional(), email_domain: z.string().max(253).optional(), assignee_ids: z.array(id).max(100).optional(), page_size: pageSize, page_number: pageNumber
  }, async (args) => result("copper.company.search", "READ", await client.post("companies/search", args)));

  server.tool("copper.company.get", TOOL_SPECS[5].description, { company_id: id }, async ({ company_id }) => result("copper.company.get", "READ", await client.get(`companies/${company_id}`)));

  server.tool("copper.company.create", TOOL_SPECS[6].description, { ...companyFields, name: z.string().min(1).max(255), approval }, async ({ approval: a, ...body }) => {
    requireApproval("WRITE", a, config); return result("copper.company.create", "WRITE", await client.post("companies", body, false));
  });

  server.tool("copper.company.update", TOOL_SPECS[7].description, { company_id: id, ...companyFields, approval }, async ({ company_id, approval: a, ...body }) => {
    requireApproval("WRITE", a, config); if (Object.keys(body).length === 0) throw new Error("At least one field is required"); return result("copper.company.update", "WRITE", await client.put(`companies/${company_id}`, body));
  });

  server.tool("copper.opportunity.search", TOOL_SPECS[8].description, {
    name: z.string().max(255).optional(), company_ids: z.array(id).max(100).optional(), assignee_ids: z.array(id).max(100).optional(), pipeline_ids: z.array(id).max(100).optional(), pipeline_stage_ids: z.array(id).max(100).optional(), page_size: pageSize, page_number: pageNumber
  }, async (args) => result("copper.opportunity.search", "READ", await client.post("opportunities/search", args)));

  server.tool("copper.opportunity.get", TOOL_SPECS[9].description, { opportunity_id: id }, async ({ opportunity_id }) => result("copper.opportunity.get", "READ", await client.get(`opportunities/${opportunity_id}`)));

  server.tool("copper.opportunity.create", TOOL_SPECS[10].description, { ...opportunityFields, name: z.string().min(1).max(255), approval }, async ({ approval: a, ...body }) => {
    requireApproval("WRITE", a, config); return result("copper.opportunity.create", "WRITE", await client.post("opportunities", body, false));
  });

  server.tool("copper.opportunity.update", TOOL_SPECS[11].description, { opportunity_id: id, ...opportunityFields, approval }, async ({ opportunity_id, approval: a, ...body }) => {
    requireApproval("WRITE", a, config); if (Object.keys(body).length === 0) throw new Error("At least one field is required"); return result("copper.opportunity.update", "WRITE", await client.put(`opportunities/${opportunity_id}`, body));
  });

  server.tool("copper.project.search", TOOL_SPECS[12].description, {
    name: z.string().max(255).optional(), assignee_ids: z.array(id).max(100).optional(), status_ids: z.array(id).max(100).optional(), page_size: pageSize, page_number: pageNumber
  }, async (args) => result("copper.project.search", "READ", await client.post("projects/search", args)));

  server.tool("copper.project.get", TOOL_SPECS[13].description, { project_id: id }, async ({ project_id }) => result("copper.project.get", "READ", await client.get(`projects/${project_id}`)));

  server.tool("copper.activity.search", TOOL_SPECS[14].description, {
    parent_id: id.optional(), parent_type: z.enum(["lead", "person", "company", "opportunity", "project", "task"]).optional(), activity_type_ids: z.array(id).max(100).optional(), page_size: pageSize, page_number: pageNumber
  }, async ({ parent_id, parent_type, ...rest }) => {
    if ((parent_id === undefined) !== (parent_type === undefined)) throw new Error("parent_id and parent_type must be supplied together");
    const body = { ...rest, ...(parent_id && parent_type ? { parent: { id: parent_id, type: parent_type } } : {}) };
    return result("copper.activity.search", "READ", await client.post("activities/search", body));
  });

  server.tool("copper.activity.create", TOOL_SPECS[15].description, {
    parent_id: id, parent_type: z.enum(["lead", "person", "company", "opportunity", "project", "task"]), activity_type_id: id, details: text.optional(), activity_date: z.number().int().nonnegative().optional(), approval
  }, async ({ parent_id, parent_type, activity_type_id, details, activity_date, approval: a }) => {
    requireApproval("WRITE", a, config);
    const body = { parent: { id: parent_id, type: parent_type }, type: { id: activity_type_id, category: "user" }, details, activity_date };
    return result("copper.activity.create", "WRITE", await client.post("activities", body, false));
  });

  server.tool("copper.custom_field.list", TOOL_SPECS[16].description, {}, async () => result("copper.custom_field.list", "READ", await client.get("custom_field_definitions")));
  server.tool("copper.pipeline.list", TOOL_SPECS[17].description, {}, async () => result("copper.pipeline.list", "READ", await client.get("pipelines")));
}
