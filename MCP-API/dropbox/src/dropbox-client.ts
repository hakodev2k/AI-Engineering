import { Dropbox } from 'dropbox';
import type { Config } from './config.js';

function statusOf(error: any): number | undefined {
  return error?.status ?? error?.error?.status ?? error?.response?.status;
}

function retryAfterMs(error: any): number | undefined {
  const raw = error?.headers?.get?.('retry-after') ?? error?.response?.headers?.get?.('retry-after');
  const seconds = raw ? Number(raw) : NaN;
  return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : undefined;
}

export class DropboxApiClient {
  private readonly dbx: any;
  private readonly sleepFn: (ms: number) => Promise<void>;

  constructor(private readonly config: Config, dbx?: any, sleepFn?: (ms: number) => Promise<void>) {
    if (!config.accessToken && !config.refreshToken && !dbx) throw new Error('DROPBOX_ACCESS_TOKEN or refresh-token credentials are required for SDK fallback');
    this.dbx = dbx ?? new Dropbox(config.refreshToken ? {
      refreshToken: config.refreshToken,
      clientId: config.appKey,
      clientSecret: config.appSecret
    } : { accessToken: config.accessToken });
    this.sleepFn = sleepFn ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
  }

  private async invoke<T>(operation: () => Promise<T>, retryable: boolean): Promise<T> {
    let attempt = 0;
    while (true) {
      const timeoutError = new Error(`Dropbox request timed out after ${this.config.timeoutMs} ms`);
      timeoutError.name = 'TimeoutError';
      let timer: NodeJS.Timeout | undefined;
      try {
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(timeoutError), this.config.timeoutMs);
        });
        return await Promise.race([operation(), timeout]);
      } catch (error: any) {
        const status = statusOf(error);
        const transient = status === 429 || (status !== undefined && status >= 500);
        if (!retryable || !transient || attempt >= this.config.maxRetries) {
          const suffix = status ? ` (HTTP ${status})` : '';
          throw new Error(`Dropbox request failed${suffix}: ${error?.message ?? String(error)}`);
        }
        const wait = retryAfterMs(error) ?? Math.min(500 * 2 ** attempt, 8000);
        attempt += 1;
        await this.sleepFn(wait);
      } finally {
        if (timer) clearTimeout(timer);
      }
    }
  }

  private read<T>(fn: () => Promise<T>) { return this.invoke(fn, true); }
  private write<T>(fn: () => Promise<T>) { return this.invoke(fn, false); }

  whoAmI() { return this.read(async () => (await this.dbx.usersGetCurrentAccount()).result); }
  listFolder(args: { path: string; recursive?: boolean; limit?: number; cursor?: string }) {
    if (args.cursor) return this.read(async () => (await this.dbx.filesListFolderContinue({ cursor: args.cursor })).result);
    return this.read(async () => (await this.dbx.filesListFolder({ path: args.path, recursive: args.recursive ?? false, limit: args.limit ?? 100 })).result);
  }
  getMetadata(path: string) { return this.read(async () => (await this.dbx.filesGetMetadata({ path })).result); }
  search(args: { query: string; path?: string; maxResults?: number }) {
    return this.read(async () => (await this.dbx.filesSearchV2({ query: args.query, options: { path: args.path, max_results: args.maxResults ?? 20, filename_only: false } })).result);
  }
  createFolder(path: string) { return this.write(async () => (await this.dbx.filesCreateFolderV2({ path, autorename: false })).result); }
  createTextFile(path: string, content: string, autorename = false) {
    return this.write(async () => (await this.dbx.filesUpload({ path, contents: Buffer.from(content, 'utf8'), mode: { '.tag': 'add' }, autorename, mute: false })).result);
  }
  copy(fromPath: string, toPath: string, autorename = false) { return this.write(async () => (await this.dbx.filesCopyV2({ from_path: fromPath, to_path: toPath, autorename })).result); }
  move(fromPath: string, toPath: string, autorename = false) { return this.write(async () => (await this.dbx.filesMoveV2({ from_path: fromPath, to_path: toPath, autorename })).result); }
  delete(path: string, parentRev?: string) { return this.write(async () => (await this.dbx.filesDeleteV2({ path, parent_rev: parentRev })).result); }
  createSharedLink(path: string, audience: 'public' | 'team' | 'no_one' = 'public') {
    return this.write(async () => (await this.dbx.sharingCreateSharedLinkWithSettings({ path, settings: { audience: { '.tag': audience } } })).result);
  }
  listSharedLinks(path?: string, cursor?: string) {
    if (cursor) return this.read(async () => (await this.dbx.sharingListSharedLinks({ cursor })).result);
    return this.read(async () => (await this.dbx.sharingListSharedLinks({ path, direct_only: Boolean(path) })).result);
  }
  listRevisions(path: string, limit = 20) { return this.read(async () => (await this.dbx.filesListRevisions({ path, limit, mode: { '.tag': 'path' } })).result); }
  restoreRevision(path: string, rev: string) { return this.write(async () => (await this.dbx.filesRestore({ path, rev })).result); }
}
