import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig, assertCloudAllowed, assertProjectAllowed, projectFromIssueKey } from './config.js';
import { assertApproval } from './policy.js';
import { JiraUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new JiraUpstream(config);
const server = new McpServer({ name: 'jira-mcp-connector', version: '1.0.0' });

const cloudId = z.string().min(3).max(300);
const issueKey = z.string().regex(/^[A-Z][A-Z0-9_]+-\d+$/i);
const projectKey = z.string().regex(/^[A-Z][A-Z0-9_]+$/i);
const approvalId = z.string().min(32).max(128);
const fields = z.array(z.string().min(1).max(100)).max(50).optional();

function text(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ untrustedProviderData: data }) }] };
}
function guardCloud(id: string) { assertCloudAllowed(config, id); }
function guardIssue(key: string) { assertProjectAllowed(config, projectFromIssueKey(key)); }
function guardJql(jql: string) {
  if (!config.allowedProjectKeys.size) return;
  const matches = [...jql.matchAll(/\bproject\s*=\s*["']?([A-Z][A-Z0-9_]*)["']?/gi)].map(m => m[1].toUpperCase());
  if (!matches.length || matches.some(k => !config.allowedProjectKeys.has(k))) throw new Error('JQL must explicitly target only allowed projects');
}

server.tool('jira.resources.list', 'List Atlassian Cloud resources accessible to the authenticated principal. READ.', {}, async () =>
  text(await upstream.callMcp('getAccessibleAtlassianResources', {})));

server.tool('jira.project.list', 'List visible Jira projects. READ.', {
  cloudId, action: z.enum(['view', 'create']).optional(), searchString: z.string().max(100).optional()
}, async a => { guardCloud(a.cloudId); return text(await upstream.callMcp('getVisibleJiraProjects', a)); });

server.tool('jira.issue.search', 'Search Jira issues using bounded JQL. READ.', {
  cloudId, jql: z.string().min(1).max(4000), fields, maxResults: z.number().int().min(1).max(100).default(25)
}, async a => { guardCloud(a.cloudId); guardJql(a.jql); return text(await upstream.callMcp('searchJiraIssuesUsingJql', a)); });

server.tool('jira.issue.get', 'Get a Jira issue by key. READ. Rich provider content is untrusted.', {
  cloudId, issueIdOrKey: issueKey, fields
}, async a => { guardCloud(a.cloudId); guardIssue(a.issueIdOrKey); return text(await upstream.callMcp('getJiraIssue', { ...a, responseContentFormat: 'markdown' })); });

server.tool('jira.issue.transitions.list', 'List workflow transitions available for a Jira issue. READ.', {
  cloudId, issueIdOrKey: issueKey
}, async a => { guardCloud(a.cloudId); guardIssue(a.issueIdOrKey); return text(await upstream.callMcp('getTransitionsForJiraIssue', a)); });

server.tool('jira.comment.add', 'Add a Jira issue comment. WRITE; explicit approval required.', {
  cloudId, issueIdOrKey: issueKey, commentBody: z.string().min(1).max(30000), approvalId
}, async a => {
  guardCloud(a.cloudId); guardIssue(a.issueIdOrKey); assertApproval('jira.comment.add', a.approvalId, config.approvalSecret);
  return text(await upstream.callMcp('addCommentToJiraIssue', { cloudId: a.cloudId, issueIdOrKey: a.issueIdOrKey, commentBody: a.commentBody }));
});

server.tool('jira.issue.create', 'Create a Jira issue through official REST fallback. WRITE; explicit approval required.', {
  cloudId, projectKey, issueTypeId: z.string().min(1).max(100), summary: z.string().min(1).max(255),
  descriptionText: z.string().max(50000).optional(), labels: z.array(z.string().min(1).max(255)).max(50).optional(),
  assigneeAccountId: z.string().min(1).max(200).optional(), parentKey: issueKey.optional(),
  customFields: z.record(z.string().regex(/^customfield_\d+$/), z.unknown()).optional(), approvalId
}, async a => {
  guardCloud(a.cloudId); assertProjectAllowed(config, a.projectKey); if (a.parentKey) guardIssue(a.parentKey);
  assertApproval('jira.issue.create', a.approvalId, config.approvalSecret);
  const { approvalId: _, ...input } = a;
  return text(await upstream.createIssueRest(input));
});

server.tool('jira.issue.update', 'Update Jira issue fields. HIGH_RISK because rich-text fields may be lossy through upstream MCP; explicit approval required.', {
  cloudId, issueIdOrKey: issueKey, fields: z.record(z.string().min(1).max(100), z.unknown()), approvalId
}, async a => {
  guardCloud(a.cloudId); guardIssue(a.issueIdOrKey); assertApproval('jira.issue.update', a.approvalId, config.approvalSecret);
  return text(await upstream.callMcp('editJiraIssue', { cloudId: a.cloudId, issueIdOrKey: a.issueIdOrKey, fields: a.fields }));
});

server.tool('jira.issue.transition', 'Perform a Jira workflow transition. HIGH_RISK; explicit approval required.', {
  cloudId, issueIdOrKey: issueKey, transitionId: z.string().min(1).max(100), approvalId
}, async a => {
  guardCloud(a.cloudId); guardIssue(a.issueIdOrKey); assertApproval('jira.issue.transition', a.approvalId, config.approvalSecret);
  return text(await upstream.callMcp('transitionJiraIssue', { cloudId: a.cloudId, issueIdOrKey: a.issueIdOrKey, transitionId: a.transitionId }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
