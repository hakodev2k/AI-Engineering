import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { BitbucketClient } from './client.js';
import { assertTargetAllowed, loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const client = new BitbucketClient(config);
const server = new McpServer({ name: 'bitbucket-mcp-connector', version: '1.0.0' });
const workspace = z.string().min(1).max(100).regex(/^[A-Za-z0-9._-]+$/);
const repo = z.string().min(1).max(100).regex(/^[A-Za-z0-9._-]+$/);
const approvalId = z.string().length(64).optional();
const pageLen = z.number().int().min(1).max(100).optional();
const enc = encodeURIComponent;
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });

server.tool('bitbucket.repository.list', 'List repositories in an allowed Bitbucket Cloud workspace.', {
  workspace, pagelen: pageLen, q: z.string().max(500).optional()
}, async a => {
  assertTargetAllowed(config, a.workspace);
  return out(await client.get(`/repositories/${enc(a.workspace)}`, { pagelen: a.pagelen, q: a.q }));
});

server.tool('bitbucket.repository.get', 'Get repository metadata.', { workspace, repo }, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  return out(await client.get(`/repositories/${enc(a.workspace)}/${enc(a.repo)}`));
});

server.tool('bitbucket.branch.list', 'List repository branches.', {
  workspace, repo, pagelen: pageLen, q: z.string().max(500).optional()
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  return out(await client.get(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/refs/branches`, { pagelen: a.pagelen, q: a.q }));
});

server.tool('bitbucket.commit.list', 'List commits from a repository or revision.', {
  workspace, repo, revision: z.string().max(200).optional(), pagelen: pageLen
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  const suffix = a.revision ? `/${enc(a.revision)}` : '';
  return out(await client.get(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/commits${suffix}`, { pagelen: a.pagelen }));
});

server.tool('bitbucket.source.read', 'Read a text file at a branch, tag, or commit. Output is capped at 200 KiB.', {
  workspace, repo, revision: z.string().min(1).max(200), path: z.string().min(1).max(2000).refine(v => !v.includes('..'), 'path traversal is not allowed')
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  const safePath = a.path.split('/').map(enc).join('/');
  const text = await client.getText(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/src/${enc(a.revision)}/${safePath}`);
  if (Buffer.byteLength(text, 'utf8') > 204800) throw new Error('Source file exceeds 200 KiB safety limit');
  return out({ workspace: a.workspace, repository: a.repo, revision: a.revision, path: a.path, content: text });
});

server.tool('bitbucket.pull_request.list', 'List pull requests.', {
  workspace, repo, state: z.enum(['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED']).optional(), pagelen: pageLen
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  return out(await client.get(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests`, { state: a.state, pagelen: a.pagelen }));
});

server.tool('bitbucket.pull_request.get', 'Get one pull request.', {
  workspace, repo, id: z.number().int().positive()
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  return out(await client.get(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests/${a.id}`));
});

server.tool('bitbucket.pull_request.create', 'Create a pull request. Requires explicit approval.', {
  workspace, repo, title: z.string().min(1).max(500), sourceBranch: z.string().min(1).max(255), destinationBranch: z.string().min(1).max(255), description: z.string().max(100000).optional(), closeSourceBranch: z.boolean().optional(), approvalId
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  assertApproval('bitbucket.pull_request.create', a.approvalId, config.approvalSecret);
  return out(await client.post(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests`, {
    title: a.title,
    description: a.description,
    source: { branch: { name: a.sourceBranch } },
    destination: { branch: { name: a.destinationBranch } },
    close_source_branch: a.closeSourceBranch ?? false
  }));
});

server.tool('bitbucket.pull_request.comment', 'Post a comment to a pull request. Requires explicit approval.', {
  workspace, repo, id: z.number().int().positive(), content: z.string().min(1).max(50000), approvalId
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  assertApproval('bitbucket.pull_request.comment', a.approvalId, config.approvalSecret);
  return out(await client.post(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests/${a.id}/comments`, { content: { raw: a.content } }));
});

server.tool('bitbucket.pull_request.approve', 'Approve a pull request as the authenticated identity. Requires explicit approval.', {
  workspace, repo, id: z.number().int().positive(), approvalId
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  assertApproval('bitbucket.pull_request.approve', a.approvalId, config.approvalSecret);
  return out(await client.post(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests/${a.id}/approve`));
});

server.tool('bitbucket.pull_request.merge', 'Merge a pull request. HIGH_RISK and requires explicit approval.', {
  workspace, repo, id: z.number().int().positive(), message: z.string().max(5000).optional(), strategy: z.enum(['merge_commit', 'squash', 'fast_forward']).optional(), closeSourceBranch: z.boolean().optional(), approvalId
}, async a => {
  assertTargetAllowed(config, a.workspace, a.repo);
  assertApproval('bitbucket.pull_request.merge', a.approvalId, config.approvalSecret);
  return out(await client.post(`/repositories/${enc(a.workspace)}/${enc(a.repo)}/pullrequests/${a.id}/merge`, {
    message: a.message,
    merge_strategy: a.strategy,
    close_source_branch: a.closeSourceBranch
  }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
