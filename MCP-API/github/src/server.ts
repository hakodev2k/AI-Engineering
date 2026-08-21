import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { assertRepositoryAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';
import { GitHubUpstream } from './upstream.js';

const config = loadConfig();
const upstream = new GitHubUpstream(config);
const server = new McpServer({ name: 'github-mcp-connector', version: '1.0.0' });

const owner = z.string().regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/);
const repo = z.string().regex(/^[A-Za-z0-9._-]{1,100}$/);
const page = z.number().int().min(1).optional();
const perPage = z.number().int().min(1).max(100).optional();
const approvalId = z.string().length(64).optional();

function output(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
}

function checkRepo(args: { owner: string; repo: string }) {
  assertRepositoryAllowed(config, args.owner, args.repo);
}

server.tool('github.user.get', 'Get the authenticated GitHub user context.', {}, async () => output(await upstream.call('get_me', {})));

server.tool('github.repository.search', 'Search GitHub repositories.', {
  query: z.string().min(1).max(256), page, perPage
}, async (a) => output(await upstream.call('search_repositories', { query: a.query, page: a.page, perPage: a.perPage, minimal_output: true })));

server.tool('github.file.read', 'Read a file or directory from an allowed repository.', {
  owner, repo, path: z.string().max(1024).default(''), ref: z.string().max(256).optional()
}, async (a) => { checkRepo(a); return output(await upstream.call('get_file_contents', a)); });

server.tool('github.code.search', 'Search indexed code using GitHub search syntax.', {
  query: z.string().min(1).max(512), page, perPage
}, async (a) => output(await upstream.call('search_code', a)));

server.tool('github.issue.search', 'Search issues using GitHub issue search syntax.', {
  query: z.string().min(1).max(512), owner: owner.optional(), repo: repo.optional(), page, perPage
}, async (a) => {
  if ((a.owner && !a.repo) || (!a.owner && a.repo)) throw new Error('owner and repo must be provided together');
  if (a.owner && a.repo) checkRepo({ owner: a.owner, repo: a.repo });
  return output(await upstream.call('search_issues', a));
});

server.tool('github.issue.get', 'Get one issue from an allowed repository.', {
  owner, repo, issueNumber: z.number().int().positive(), page, perPage
}, async (a) => {
  checkRepo(a);
  return output(await upstream.call('issue_read', { method: 'get', owner: a.owner, repo: a.repo, issue_number: a.issueNumber, page: a.page, perPage: a.perPage }));
});

server.tool('github.pull_request.get', 'Get one pull request from an allowed repository.', {
  owner, repo, pullNumber: z.number().int().positive()
}, async (a) => {
  checkRepo(a);
  return output(await upstream.call('pull_request_read', { method: 'get', owner: a.owner, repo: a.repo, pullNumber: a.pullNumber }));
});

server.tool('github.branch.create', 'Create a branch in an allowed repository. Requires approval.', {
  owner, repo, branch: z.string().min(1).max(255), fromBranch: z.string().min(1).max(255).optional(), approvalId
}, async (a) => {
  checkRepo(a); assertApproval('github.branch.create', a.approvalId, config.approvalSecret);
  return output(await upstream.call('create_branch', { owner: a.owner, repo: a.repo, branch: a.branch, from_branch: a.fromBranch }));
});

server.tool('github.issue.create', 'Create an issue in an allowed repository. Requires approval.', {
  owner, repo, title: z.string().min(1).max(256), body: z.string().max(65536).optional(), labels: z.array(z.string().max(100)).max(20).optional(), assignees: z.array(z.string().max(39)).max(10).optional(), approvalId
}, async (a) => {
  checkRepo(a); assertApproval('github.issue.create', a.approvalId, config.approvalSecret);
  return output(await upstream.call('issue_write', { method: 'create', owner: a.owner, repo: a.repo, title: a.title, body: a.body, labels: a.labels, assignees: a.assignees }));
});

server.tool('github.issue.comment', 'Add a comment to an issue. Requires approval.', {
  owner, repo, issueNumber: z.number().int().positive(), body: z.string().min(1).max(65536), approvalId
}, async (a) => {
  checkRepo(a); assertApproval('github.issue.comment', a.approvalId, config.approvalSecret);
  return output(await upstream.call('add_issue_comment', { owner: a.owner, repo: a.repo, issue_number: a.issueNumber, body: a.body }));
});

server.tool('github.pull_request.create', 'Open a pull request. Requires approval.', {
  owner, repo, title: z.string().min(1).max(256), head: z.string().min(1).max(255), base: z.string().min(1).max(255), body: z.string().max(65536).optional(), draft: z.boolean().default(true), approvalId
}, async (a) => {
  checkRepo(a); assertApproval('github.pull_request.create', a.approvalId, config.approvalSecret);
  return output(await upstream.call('create_pull_request', { owner: a.owner, repo: a.repo, title: a.title, head: a.head, base: a.base, body: a.body, draft: a.draft }));
});

server.tool('github.pull_request.merge', 'Merge a pull request. High risk and always requires explicit approval.', {
  owner, repo, pullNumber: z.number().int().positive(), mergeMethod: z.enum(['merge','squash','rebase']).optional(), commitTitle: z.string().max(256).optional(), commitMessage: z.string().max(65536).optional(), approvalId: z.string().length(64)
}, async (a) => {
  checkRepo(a); assertApproval('github.pull_request.merge', a.approvalId, config.approvalSecret);
  return output(await upstream.call('merge_pull_request', { owner: a.owner, repo: a.repo, pullNumber: a.pullNumber, merge_method: a.mergeMethod, commit_title: a.commitTitle, commit_message: a.commitMessage }, 30_000));
});

await server.connect(new StdioServerTransport());
