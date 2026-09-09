import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { NgrokClient } from './client.js';
import { authorize, type Risk } from './policy.js';

const cfg = loadConfig();
const api = new NgrokClient(cfg);
const server = new McpServer({ name: 'ngrok-connector', version: '1.0.0' });

const id = z.string().min(1).max(128);
const pagination = {
  limit: z.number().int().min(1).max(100).optional(),
  before_id: z.string().min(1).max(128).optional(),
  filter: z.string().min(1).max(2048).optional()
};
const approval = { approved: z.boolean().optional() };

function result(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ provider: 'ngrok', untrusted_data: true, result: value }, null, 2) }] };
}

function register(name: string, description: string, risk: Risk, inputSchema: Record<string, z.ZodTypeAny>, run: (args: any) => Promise<unknown>) {
  server.registerTool(name, {
    description: `${description} Risk=${risk}. ${risk === 'READ' ? 'No approval required.' : 'Human approval policy applies.'}`,
    inputSchema
  }, async (args: any) => {
    try {
      authorize(risk, args.approved, cfg);
      return result(await run(args));
    } catch (error) {
      return { isError: true, content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Unknown error' }] };
    }
  });
}

register('ngrok.endpoint.list', 'List active and cloud endpoints with pagination/filtering.', 'READ', pagination,
  a => api.request('GET', '/endpoints', undefined, a));
register('ngrok.endpoint.get', 'Get an endpoint by resource ID.', 'READ', { endpoint_id: id },
  a => api.request('GET', `/endpoints/${encodeURIComponent(a.endpoint_id)}`));
register('ngrok.endpoint.create', 'Create a persistent cloud endpoint.', 'WRITE', {
  url: z.string().url().max(2048),
  type: z.literal('cloud').default('cloud'),
  traffic_policy: z.string().min(1).max(100000),
  description: z.string().max(255).optional(),
  metadata: z.string().max(4096).optional(),
  bindings: z.array(z.string().min(1).max(64)).max(20).optional(),
  pooling_enabled: z.boolean().optional(),
  ...approval
}, a => {
  const { approved, ...body } = a;
  return api.request('POST', '/endpoints', body);
});
register('ngrok.endpoint.update', 'Update a cloud endpoint configuration.', 'WRITE', {
  endpoint_id: id,
  url: z.string().url().max(2048).optional(),
  traffic_policy: z.string().min(1).max(100000).optional(),
  description: z.string().max(255).optional(),
  metadata: z.string().max(4096).optional(),
  bindings: z.array(z.string().min(1).max(64)).max(20).optional(),
  pooling_enabled: z.boolean().optional(),
  ...approval
}, a => {
  const { approved, endpoint_id, ...body } = a;
  if (Object.keys(body).length === 0) throw new Error('At least one endpoint field must be provided');
  return api.request('PATCH', `/endpoints/${encodeURIComponent(endpoint_id)}`, body);
});
register('ngrok.endpoint.delete', 'Delete a cloud endpoint.', 'DESTRUCTIVE', { endpoint_id: id, ...approval },
  a => api.request('DELETE', `/endpoints/${encodeURIComponent(a.endpoint_id)}`));

register('ngrok.reserved_domain.list', 'List reserved domains with pagination/filtering.', 'READ', pagination,
  a => api.request('GET', '/reserved_domains', undefined, a));
register('ngrok.reserved_domain.get', 'Get a reserved domain by resource ID.', 'READ', { domain_id: id },
  a => api.request('GET', `/reserved_domains/${encodeURIComponent(a.domain_id)}`));
register('ngrok.reserved_domain.create', 'Reserve a domain for ngrok traffic.', 'WRITE', {
  domain: z.string().min(1).max(253).regex(/^(\*\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/),
  description: z.string().max(255).optional(),
  metadata: z.string().max(4096).optional(),
  ...approval
}, a => {
  const { approved, ...body } = a;
  return api.request('POST', '/reserved_domains', body);
});
register('ngrok.reserved_domain.update', 'Update metadata and description for a reserved domain.', 'WRITE', {
  domain_id: id,
  description: z.string().max(255).optional(),
  metadata: z.string().max(4096).optional(),
  ...approval
}, a => {
  const { approved, domain_id, ...body } = a;
  if (Object.keys(body).length === 0) throw new Error('At least one reserved-domain field must be provided');
  return api.request('PATCH', `/reserved_domains/${encodeURIComponent(domain_id)}`, body);
});
register('ngrok.reserved_domain.delete', 'Release a reserved domain.', 'DESTRUCTIVE', { domain_id: id, ...approval },
  a => api.request('DELETE', `/reserved_domains/${encodeURIComponent(a.domain_id)}`));

await server.connect(new StdioServerTransport());
