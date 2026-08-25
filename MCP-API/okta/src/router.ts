import type { OktaConfig } from './config.js';
import { OktaRestClient } from './rest.js';
import { OktaUpstreamMcp } from './upstream-mcp.js';

export type ExecutionResult = { transport: 'mcp' | 'rest'; data: unknown };
const enc = (value: string) => encodeURIComponent(value);

const MCP_MAP: Record<string, string> = {
  'okta.user.search': 'list_users',
  'okta.user.get': 'get_user',
  'okta.user.create': 'create_user',
  'okta.user.update': 'update_user',
  'okta.group.list': 'list_groups',
  'okta.group.get': 'get_group',
  'okta.group.create': 'create_group',
  'okta.group.members.list': 'list_group_users',
  'okta.group.member.add': 'add_user_to_group',
  'okta.group.member.remove': 'remove_user_from_group',
  'okta.application.list': 'list_applications',
  'okta.application.get': 'get_application',
  'okta.system_log.query': 'get_logs'
};

export class OktaRouter {
  constructor(private readonly config: OktaConfig, private readonly rest: OktaRestClient = new OktaRestClient(config), private readonly mcp: OktaUpstreamMcp = new OktaUpstreamMcp(config)) {}

  private async preferMcp(tool: string, args: Record<string, unknown>, restCall: () => Promise<unknown>): Promise<ExecutionResult> {
    const upstreamTool = MCP_MAP[tool];
    if (this.config.mcpEnabled && upstreamTool) {
      try {
        await this.mcp.connect();
        if (this.mcp.hasTool(upstreamTool)) return { transport: 'mcp', data: await this.mcp.call(upstreamTool, args) };
      } catch (error) {
        if (!this.config.allowRestFallback) throw error;
      }
    }
    if (!this.config.allowRestFallback && this.config.mcpEnabled) throw new Error(`Official Okta MCP does not expose required capability for ${tool}`);
    return { transport: 'rest', data: await restCall() };
  }

  async execute(tool: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<ExecutionResult> {
    switch (tool) {
      case 'okta.user.search': {
        const search = typeof args.search === 'string' ? args.search : undefined;
        const limit = typeof args.limit === 'number' ? args.limit : 100;
        const path = `/api/v1/users?limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
        return this.preferMcp(tool, { search, limit }, () => this.rest.list(path, limit, signal));
      }
      case 'okta.user.get': {
        const id = String(args.id);
        return this.preferMcp(tool, { user_id: id }, async () => (await this.rest.request(`/api/v1/users/${enc(id)}`, { signal })).data);
      }
      case 'okta.user.create': {
        const profile = args.profile as Record<string, unknown>; const activate = args.activate === true;
        return this.preferMcp(tool, { profile, activate }, async () => (await this.rest.request(`/api/v1/users?activate=${activate}`, { method: 'POST', body: { profile }, signal, retryable: false })).data);
      }
      case 'okta.user.update': {
        const id = String(args.id); const profile = args.profile as Record<string, unknown>;
        return this.preferMcp(tool, { user_id: id, profile }, async () => (await this.rest.request(`/api/v1/users/${enc(id)}`, { method: 'POST', body: { profile }, signal, retryable: false })).data);
      }
      case 'okta.user.suspend': {
        const id = String(args.id);
        return { transport: 'rest', data: (await this.rest.request(`/api/v1/users/${enc(id)}/lifecycle/suspend`, { method: 'POST', signal, retryable: false })).data };
      }
      case 'okta.user.unsuspend': {
        const id = String(args.id);
        return { transport: 'rest', data: (await this.rest.request(`/api/v1/users/${enc(id)}/lifecycle/unsuspend`, { method: 'POST', signal, retryable: false })).data };
      }
      case 'okta.group.list': {
        const q = typeof args.q === 'string' ? args.q : undefined; const limit = typeof args.limit === 'number' ? args.limit : 100;
        const path = `/api/v1/groups?limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
        return this.preferMcp(tool, { q, limit }, () => this.rest.list(path, limit, signal));
      }
      case 'okta.group.get': {
        const id = String(args.id);
        return this.preferMcp(tool, { group_id: id }, async () => (await this.rest.request(`/api/v1/groups/${enc(id)}`, { signal })).data);
      }
      case 'okta.group.create': {
        const name = String(args.name); const description = typeof args.description === 'string' ? args.description : undefined;
        const profile = { name, ...(description ? { description } : {}) };
        return this.preferMcp(tool, profile, async () => (await this.rest.request('/api/v1/groups', { method: 'POST', body: { profile }, signal, retryable: false })).data);
      }
      case 'okta.group.members.list': {
        const groupId = String(args.groupId); const limit = typeof args.limit === 'number' ? args.limit : 100;
        return this.preferMcp(tool, { group_id: groupId, limit }, () => this.rest.list(`/api/v1/groups/${enc(groupId)}/users?limit=${limit}`, limit, signal));
      }
      case 'okta.group.member.add': {
        const groupId = String(args.groupId); const userId = String(args.userId);
        return this.preferMcp(tool, { group_id: groupId, user_id: userId }, async () => (await this.rest.request(`/api/v1/groups/${enc(groupId)}/users/${enc(userId)}`, { method: 'PUT', signal, retryable: false })).data);
      }
      case 'okta.group.member.remove': {
        const groupId = String(args.groupId); const userId = String(args.userId);
        return this.preferMcp(tool, { group_id: groupId, user_id: userId }, async () => (await this.rest.request(`/api/v1/groups/${enc(groupId)}/users/${enc(userId)}`, { method: 'DELETE', signal, retryable: false })).data);
      }
      case 'okta.application.list': {
        const q = typeof args.q === 'string' ? args.q : undefined; const limit = typeof args.limit === 'number' ? args.limit : 100;
        const path = `/api/v1/apps?limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
        return this.preferMcp(tool, { q, limit }, () => this.rest.list(path, limit, signal));
      }
      case 'okta.application.get': {
        const id = String(args.id);
        return this.preferMcp(tool, { app_id: id }, async () => (await this.rest.request(`/api/v1/apps/${enc(id)}`, { signal })).data);
      }
      case 'okta.system_log.query': {
        const params = new URLSearchParams();
        if (args.since) params.set('since', String(args.since)); if (args.until) params.set('until', String(args.until)); if (args.filter) params.set('filter', String(args.filter));
        const limit = typeof args.limit === 'number' ? args.limit : 100; params.set('limit', String(limit));
        return this.preferMcp(tool, { since: args.since, until: args.until, filter: args.filter, limit }, () => this.rest.list(`/api/v1/logs?${params.toString()}`, limit, signal));
      }
      default: throw new Error(`Unsupported tool: ${tool}`);
    }
  }

  async close(): Promise<void> { await this.mcp.close(); }
}
