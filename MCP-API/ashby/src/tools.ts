import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { Config } from "./config.js";
import { rejectPrivateFieldsRequested, requireApproval, type Risk } from "./policy.js";
import type { Upstream } from "./upstream.js";

const uuid = z.string().uuid();
const pagination = { cursor: z.string().optional(), limit: z.number().int().min(1).max(100).optional() };
const approval = z.enum(["approved", "approved-high-risk"]).optional();

type Shape = Record<string, z.ZodTypeAny>;
function output(tool: string, risk: Risk, value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify({ provider: "Ashby", tool, risk, untrusted_provider_content: true, value }, null, 2) }] };
}

function register(server: McpServer, upstream: Upstream, config: Config, spec: {
  name: string; description: string; endpoint: string; keywords: string[]; risk: Risk; shape: Shape;
}) {
  server.tool(spec.name, spec.description, spec.shape, async (args) => {
    const record = args as Record<string, unknown>;
    requireApproval(spec.risk, record.approval as string | undefined, config);
    rejectPrivateFieldsRequested(record, config);
    const body = { ...record }; delete body.approval;
    const value = await upstream.call(spec.name, spec.endpoint, body, spec.keywords);
    return output(spec.name, spec.risk, value);
  });
}

export function registerTools(server: McpServer, upstream: Upstream, config: Config): void {
  const specs = [
    { name: "ashby.job.list", description: "List jobs with cursor pagination.", endpoint: "job.list", keywords: ["job", "list"], risk: "READ" as Risk, shape: { ...pagination, status: z.enum(["Open", "Closed", "Archived"]).optional() } },
    { name: "ashby.job.search", description: "Search jobs by a specific query.", endpoint: "job.search", keywords: ["job", "search"], risk: "READ" as Risk, shape: { query: z.string().min(1).max(200) } },
    { name: "ashby.job.read", description: "Read one job by UUID.", endpoint: "job.info", keywords: ["job", "info"], risk: "READ" as Risk, shape: { jobId: uuid } },
    { name: "ashby.candidate.list", description: "List candidates with cursor pagination.", endpoint: "candidate.list", keywords: ["candidate", "list"], risk: "READ" as Risk, shape: { ...pagination, includeArchived: z.boolean().optional() } },
    { name: "ashby.candidate.search", description: "Search candidates by name or email.", endpoint: "candidate.search", keywords: ["candidate", "search"], risk: "READ" as Risk, shape: { query: z.string().min(1).max(300) } },
    { name: "ashby.candidate.read", description: "Read one candidate by UUID.", endpoint: "candidate.info", keywords: ["candidate", "info"], risk: "READ" as Risk, shape: { candidateId: uuid } },
    { name: "ashby.application.list", description: "List applications, optionally filtering by job or candidate.", endpoint: "application.list", keywords: ["application", "list"], risk: "READ" as Risk, shape: { ...pagination, jobId: uuid.optional(), candidateId: uuid.optional(), includeArchived: z.boolean().optional() } },
    { name: "ashby.application.read", description: "Read one application by UUID.", endpoint: "application.info", keywords: ["application", "info"], risk: "READ" as Risk, shape: { applicationId: uuid } },
    { name: "ashby.interview.list", description: "List interviews with pagination.", endpoint: "interview.list", keywords: ["interview", "list"], risk: "READ" as Risk, shape: { ...pagination, includeArchived: z.boolean().optional(), includeNonSharedInterviews: z.boolean().optional() } },
    { name: "ashby.interview_stage.list", description: "List interview stages.", endpoint: "interviewStage.list", keywords: ["interview", "stage", "list"], risk: "READ" as Risk, shape: { ...pagination, interviewPlanId: uuid.optional() } },
    { name: "ashby.candidate_note.list", description: "List notes attached to a candidate.", endpoint: "candidate.listNotes", keywords: ["candidate", "note", "list"], risk: "READ" as Risk, shape: { candidateId: uuid, ...pagination } },
    { name: "ashby.candidate_note.create", description: "Add a note to a candidate. Notifications are off by default.", endpoint: "candidate.createNote", keywords: ["candidate", "note", "create"], risk: "WRITE" as Risk, shape: { candidateId: uuid, note: z.string().min(1).max(20_000), sendNotifications: z.boolean().default(false), isPrivate: z.literal(false).default(false), approval } },
    { name: "ashby.application.create", description: "Consider an existing candidate for a job.", endpoint: "application.create", keywords: ["application", "create"], risk: "WRITE" as Risk, shape: { candidateId: uuid, jobId: uuid, interviewPlanId: uuid.optional(), interviewStageId: uuid.optional(), sourceId: uuid.optional(), approval } },
    { name: "ashby.application.stage.update", description: "Move an application to another interview stage. Archiving/rejection is high risk; supply archiveReasonId only with explicit high-risk approval.", endpoint: "application.changeStage", keywords: ["application", "stage"], risk: "HIGH_RISK" as Risk, shape: { applicationId: uuid, interviewStageId: uuid, archiveReasonId: uuid.optional(), approval } }
  ];
  for (const spec of specs) register(server, upstream, config, spec);
}
