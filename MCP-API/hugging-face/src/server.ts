import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { HuggingFaceClient } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new HuggingFaceClient(config);
const server = new McpServer({ name: 'hugging-face-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const RepoId = z.string().min(1).max(256).regex(/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/);
const RepoType = z.enum(['model', 'dataset', 'space']);

server.tool('huggingface.model.search', 'Search Hub models. READ.', {
  search: z.string().min(1).max(200), limit: z.number().int().min(1).max(100).default(20),
  author: z.string().max(100).optional(), filter: z.string().max(200).optional(), sort: z.string().max(50).optional(), direction: z.number().int().min(-1).max(1).optional()
}, async (args) => json(await client.request('/api/models', { query: args })));

server.tool('huggingface.model.get', 'Get model metadata. READ.', { repo_id: RepoId },
  async ({ repo_id }) => json(await client.request(`/api/models/${repo_id}`)));

server.tool('huggingface.dataset.search', 'Search Hub datasets. READ.', {
  search: z.string().min(1).max(200), limit: z.number().int().min(1).max(100).default(20), author: z.string().max(100).optional()
}, async (args) => json(await client.request('/api/datasets', { query: args })));

server.tool('huggingface.dataset.get', 'Get dataset metadata. READ.', { repo_id: RepoId },
  async ({ repo_id }) => json(await client.request(`/api/datasets/${repo_id}`)));

server.tool('huggingface.space.search', 'Search Hub Spaces. READ.', {
  search: z.string().min(1).max(200), limit: z.number().int().min(1).max(100).default(20), author: z.string().max(100).optional()
}, async (args) => json(await client.request('/api/spaces', { query: args })));

server.tool('huggingface.space.get', 'Get Space metadata. READ.', { repo_id: RepoId },
  async ({ repo_id }) => json(await client.request(`/api/spaces/${repo_id}`)));

server.tool('huggingface.repo.file.list', 'List files in a Hub repository. READ.', {
  repo_id: RepoId, repo_type: RepoType.default('model'), revision: z.string().min(1).max(200).default('main'), recursive: z.boolean().default(false)
}, async ({ repo_id, repo_type, revision, recursive }) => {
  const plural = repo_type === 'model' ? 'models' : repo_type === 'dataset' ? 'datasets' : 'spaces';
  return json(await client.request(`/api/${plural}/${repo_id}/tree/${encodeURIComponent(revision)}`, { query: { recursive, expand: false } }));
});

server.tool('huggingface.user.whoami', 'Return identity and organizations visible to the configured token. READ.', {},
  async () => json(await client.request('/api/whoami-v2')));

server.tool('huggingface.inference.chat', 'Run a bounded chat-completion request through Hugging Face Inference Providers. WRITE_EXTERNAL_COMPUTE; operator approval required by default because it can consume paid inference credits.', {
  model: z.string().min(1).max(300),
  messages: z.array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().min(1).max(20000) }).strict()).min(1).max(50),
  max_tokens: z.number().int().min(1).max(4096).default(512), temperature: z.number().min(0).max(2).default(0.2)
}, async (body) => {
  assertWriteAllowed(config, 'huggingface.inference.chat');
  return json(await client.request('/chat/completions', { method: 'POST', inference: true, body: { ...body, stream: false } }));
});

server.tool('huggingface.repo.create', 'Create a model, dataset, or Space repository. WRITE; explicit operator approval required.', {
  name: z.string().min(1).max(96).regex(/^[A-Za-z0-9._-]+$/), organization: z.string().min(1).max(96).optional(), type: RepoType.default('model'), private: z.boolean().default(true), sdk: z.string().max(40).optional()
}, async ({ name, organization, type, private: isPrivate, sdk }) => {
  assertWriteAllowed(config, 'huggingface.repo.create');
  return json(await client.request('/api/repos/create', { method: 'POST', body: { name, organization, type, private: isPrivate, sdk } }));
});

server.tool('huggingface.repo.delete', 'Delete a Hub repository. DESTRUCTIVE; disabled by default and requires strong operator approval.', {
  repo_id: RepoId, repo_type: RepoType
}, async ({ repo_id, repo_type }) => {
  assertWriteAllowed(config, 'huggingface.repo.delete', true);
  const [organization, name] = repo_id.split('/');
  return json(await client.request('/api/repos/delete', { method: 'DELETE', body: { name, organization, type: repo_type } }));
});

await server.connect(new StdioServerTransport());
