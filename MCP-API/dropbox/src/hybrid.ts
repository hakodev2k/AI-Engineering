import type { Config } from './config.js';
import { DropboxApiClient } from './dropbox-client.js';
import { DropboxUpstreamMcp } from './upstream-mcp.js';

type McpLike = { enabled: boolean; call(tool: string, args: Record<string, unknown>): Promise<unknown>; close(): Promise<void> };
type ApiLike = Pick<DropboxApiClient,
  'whoAmI' | 'listFolder' | 'getMetadata' | 'search' | 'listSharedLinks' | 'listRevisions' |
  'createFolder' | 'createTextFile' | 'copy' | 'move' | 'delete' | 'createSharedLink' | 'restoreRevision'>;

export class DropboxHybrid {
  private readonly mcp: McpLike;
  private api?: ApiLike;

  constructor(private readonly config: Config, deps: { mcp?: McpLike; api?: ApiLike } = {}) {
    this.mcp = deps.mcp ?? new DropboxUpstreamMcp(config);
    this.api = deps.api;
  }

  private apiClient(): ApiLike {
    if (!this.api) this.api = new DropboxApiClient(this.config);
    return this.api;
  }

  private hasApiCredentials(): boolean {
    return Boolean(this.config.accessToken || this.config.refreshToken || this.api);
  }

  private async routeRead(mcpTool: string, mcpArgs: Record<string, unknown>, api: () => Promise<unknown>): Promise<unknown> {
    if (this.mcp.enabled) {
      try { return await this.mcp.call(mcpTool, mcpArgs); }
      catch (error) {
        if (!this.hasApiCredentials()) throw error;
      }
    }
    return api();
  }

  private async routeWrite(mcpTool: string, mcpArgs: Record<string, unknown>, api: () => Promise<unknown>): Promise<unknown> {
    if (this.mcp.enabled) {
      // No automatic write fallback: an MCP network failure can be ambiguous after commit.
      return this.mcp.call(mcpTool, mcpArgs);
    }
    return api();
  }

  whoAmI() { return this.routeRead('WhoAmI', {}, () => this.apiClient().whoAmI()); }
  listFolder(args: { path: string; recursive?: boolean; limit?: number; cursor?: string }) { return this.routeRead('ListFolder', args, () => this.apiClient().listFolder(args)); }
  getMetadata(path: string) { return this.routeRead('GetFileMetadata', { path }, () => this.apiClient().getMetadata(path)); }
  search(args: { query: string; path?: string; maxResults?: number }) { return this.routeRead('Search', args, () => this.apiClient().search(args)); }
  listSharedLinks(path?: string, cursor?: string) { return this.routeRead('ListSharedLinks', { path, cursor }, () => this.apiClient().listSharedLinks(path, cursor)); }
  listRevisions(path: string, limit?: number) { return this.routeRead('ListFileRevisions', { path, limit }, () => this.apiClient().listRevisions(path, limit)); }
  createFolder(path: string) { return this.routeWrite('CreateFolder', { path }, () => this.apiClient().createFolder(path)); }
  createTextFile(path: string, content: string, autorename = false) { return this.routeWrite('CreateFile', { path, content }, () => this.apiClient().createTextFile(path, content, autorename)); }
  copy(fromPath: string, toPath: string, autorename = false) { return this.routeWrite('Copy', { from_path: fromPath, to_path: toPath }, () => this.apiClient().copy(fromPath, toPath, autorename)); }
  move(fromPath: string, toPath: string, autorename = false) { return this.routeWrite('Move', { from_path: fromPath, to_path: toPath }, () => this.apiClient().move(fromPath, toPath, autorename)); }
  delete(path: string, parentRev?: string) { return this.routeWrite('Delete', { path }, () => this.apiClient().delete(path, parentRev)); }
  createSharedLink(path: string, audience: 'public' | 'team' | 'no_one') { return this.routeWrite('CreateSharedLink', { path, audience }, () => this.apiClient().createSharedLink(path, audience)); }
  restoreRevision(path: string, rev: string) { return this.routeWrite('RestoreFileRevision', { path, rev }, () => this.apiClient().restoreRevision(path, rev)); }
  close() { return this.mcp.close(); }
}
