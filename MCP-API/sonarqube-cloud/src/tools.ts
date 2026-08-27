import { z } from 'zod';

export type Risk = 'READ' | 'WRITE';
export type ToolDef = {
  name: string;
  description: string;
  upstream: string;
  risk: Risk;
  approval: boolean;
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
};

const approval = { approvalToken: z.string().length(64) };
const projectKey = z.string().min(1).max(400);
const branch = z.string().min(1).max(255).optional();
const pullRequest = z.string().min(1).max(255).optional();
const pageIndex = z.number().int().min(1).max(10000).optional();
const pageSize = z.number().int().min(1).max(500).optional();

export const TOOLS: ToolDef[] = [
  {
    name: 'sonarqube.project.search',
    description: 'Search SonarQube Cloud projects available to the authenticated user.',
    upstream: 'search_my_sonarqube_projects', risk: 'READ', approval: false,
    schema: z.object({ q: z.string().max(400).optional(), pageIndex, pageSize }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, properties: { q: { type: 'string', maxLength: 400 }, pageIndex: { type: 'integer', minimum: 1 }, pageSize: { type: 'integer', minimum: 1, maximum: 500 } } }
  },
  {
    name: 'sonarqube.branch.list', description: 'List analyzed branches for a project.',
    upstream: 'list_branches', risk: 'READ', approval: false,
    schema: z.object({ projectKey }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['projectKey'], properties: { projectKey: { type: 'string', minLength: 1, maxLength: 400 } } }
  },
  {
    name: 'sonarqube.pull_request.list', description: 'List analyzed pull requests for a project.',
    upstream: 'list_pull_requests', risk: 'READ', approval: false,
    schema: z.object({ projectKey }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['projectKey'], properties: { projectKey: { type: 'string', minLength: 1, maxLength: 400 } } }
  },
  {
    name: 'sonarqube.issue.search', description: 'Search SonarQube issues across selected projects.',
    upstream: 'search_sonar_issues_in_projects', risk: 'READ', approval: false,
    schema: z.object({ projectKeys: z.array(projectKey).max(50).optional(), branch, pullRequest, severities: z.array(z.enum(['INFO','LOW','MEDIUM','HIGH','BLOCKER'])).max(5).optional(), impactSoftwareQualities: z.array(z.enum(['MAINTAINABILITY','RELIABILITY','SECURITY'])).max(3).optional(), pageIndex, pageSize }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, properties: { projectKeys: { type: 'array', maxItems: 50, items: { type: 'string' } }, branch: { type: 'string' }, pullRequest: { type: 'string' }, severities: { type: 'array', items: { enum: ['INFO','LOW','MEDIUM','HIGH','BLOCKER'] } }, impactSoftwareQualities: { type: 'array', items: { enum: ['MAINTAINABILITY','RELIABILITY','SECURITY'] } }, pageIndex: { type: 'integer', minimum: 1 }, pageSize: { type: 'integer', minimum: 1, maximum: 500 } } }
  },
  {
    name: 'sonarqube.issue.status.change', description: 'Change an issue to accepted, false-positive, or reopened. Requires human approval.',
    upstream: 'change_sonar_issue_status', risk: 'WRITE', approval: true,
    schema: z.object({ key: z.string().min(1).max(200), status: z.enum(['accept','falsepositive','reopen']), ...approval }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['key','status','approvalToken'], properties: { key: { type: 'string' }, status: { enum: ['accept','falsepositive','reopen'] }, approvalToken: { type: 'string', minLength: 64, maxLength: 64 } } }
  },
  {
    name: 'sonarqube.quality_gate.status.get', description: 'Get the project quality gate status for a branch, pull request, analysis, or project.',
    upstream: 'get_project_quality_gate_status', risk: 'READ', approval: false,
    schema: z.object({ analysisId: z.string().max(200).optional(), branch, projectId: z.string().max(200).optional(), projectKey: projectKey.optional(), pullRequest }).strict().refine(v => !!(v.analysisId || v.projectId || v.projectKey), 'One of analysisId, projectId, or projectKey is required'),
    inputSchema: { type: 'object', additionalProperties: false, properties: { analysisId: { type: 'string' }, branch: { type: 'string' }, projectId: { type: 'string' }, projectKey: { type: 'string' }, pullRequest: { type: 'string' } }, anyOf: [{ required: ['analysisId'] }, { required: ['projectId'] }, { required: ['projectKey'] }] }
  },
  {
    name: 'sonarqube.quality_gate.list', description: 'List quality gates available in SonarQube.',
    upstream: 'list_quality_gates', risk: 'READ', approval: false,
    schema: z.object({}).strict(), inputSchema: { type: 'object', additionalProperties: false, properties: {} }
  },
  {
    name: 'sonarqube.measure.get', description: 'Retrieve measures such as coverage, complexity, violations, and LOC for a component.',
    upstream: 'get_component_measures', risk: 'READ', approval: false,
    schema: z.object({ projectKey, branch, pullRequest, metricKeys: z.array(z.string().regex(/^[a-zA-Z0-9_.-]+$/).max(100)).max(50).optional() }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['projectKey'], properties: { projectKey: { type: 'string' }, branch: { type: 'string' }, pullRequest: { type: 'string' }, metricKeys: { type: 'array', maxItems: 50, items: { type: 'string', pattern: '^[a-zA-Z0-9_.-]+$' } } } }
  },
  {
    name: 'sonarqube.security_hotspot.search', description: 'Search Security Hotspots in a project.',
    upstream: 'search_security_hotspots', risk: 'READ', approval: false,
    schema: z.object({ projectKey, hotspotKeys: z.array(z.string().min(1).max(200)).max(100).optional(), branch, pullRequest, files: z.array(z.string().min(1).max(1000)).max(100).optional(), pageIndex, pageSize }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['projectKey'], properties: { projectKey: { type: 'string' }, hotspotKeys: { type: 'array', maxItems: 100, items: { type: 'string' } }, branch: { type: 'string' }, pullRequest: { type: 'string' }, files: { type: 'array', maxItems: 100, items: { type: 'string' } }, pageIndex: { type: 'integer', minimum: 1 }, pageSize: { type: 'integer', minimum: 1, maximum: 500 } } }
  },
  {
    name: 'sonarqube.security_hotspot.get', description: 'Get detailed information about a specific Security Hotspot.',
    upstream: 'show_security_hotspot', risk: 'READ', approval: false,
    schema: z.object({ hotspotKey: z.string().min(1).max(200) }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['hotspotKey'], properties: { hotspotKey: { type: 'string' } } }
  },
  {
    name: 'sonarqube.security_hotspot.review', description: 'Review a Security Hotspot and optionally resolve it. Requires human approval.',
    upstream: 'change_security_hotspot_status', risk: 'WRITE', approval: true,
    schema: z.object({ hotspotKey: z.string().min(1).max(200), status: z.enum(['TO_REVIEW','REVIEWED']), resolution: z.enum(['FIXED','SAFE','ACKNOWLEDGED']).optional(), comment: z.string().max(4000).optional(), ...approval }).strict().refine(v => v.status !== 'REVIEWED' || !!v.resolution, 'resolution is required when status is REVIEWED'),
    inputSchema: { type: 'object', additionalProperties: false, required: ['hotspotKey','status','approvalToken'], properties: { hotspotKey: { type: 'string' }, status: { enum: ['TO_REVIEW','REVIEWED'] }, resolution: { enum: ['FIXED','SAFE','ACKNOWLEDGED'] }, comment: { type: 'string', maxLength: 4000 }, approvalToken: { type: 'string', minLength: 64, maxLength: 64 } } }
  },
  {
    name: 'sonarqube.rule.get', description: 'Get details for a SonarQube rule by key.',
    upstream: 'show_rule', risk: 'READ', approval: false,
    schema: z.object({ key: z.string().min(1).max(200) }).strict(),
    inputSchema: { type: 'object', additionalProperties: false, required: ['key'], properties: { key: { type: 'string' } } }
  }
];

export const TOOL_BY_NAME = new Map(TOOLS.map(t => [t.name, t]));
