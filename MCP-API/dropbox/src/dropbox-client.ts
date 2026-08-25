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
    if (!config.accessToken && !dbx) throw new Error('DROPBOX_ACCESS_TOKEN is required for SDK fallback');
    this.dbx = dbx ?? new Dropbox({ accessToken: config.accessToken });
    this.sleepFn = sleepFn ?? (ms => new Promise(resolve => setTimeout(resolve, ms)));
  }

  private async invoke<T>(operation: (signal: AbortSignal) => Promise<T>, retryable: boolean): Promise<T> {
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timeoutError = new Error(`Dropbox request timed out after ${this.config.timeoutMs} ms`);
      timeoutError.name = 'TimeoutError';
      let timer: NodeJS.Timeout | undefined;
      try {
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(timeoutError); }, this.config.timeoutMs);
        });
        return await Promise.race([operation(controller.signal), timeout]);
      } catch (error: any) {
        const status = statusOf(error);
        const transient = status === 429 || (status !== undefined && status >= 500) || error?.name === 'AbortError' || error?.name === 'TimeoutError';
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

  private read<T>(fn: (signal: AbortSignal) => Promise<T>) { return this.invoke(fn, true); }
  private write<T>(fn: (signal: AbortSignal) => Promise<T>) { return this.invoke(fn, false); }

  whoAmI() {
    return this.read(async signal => (await this.dbx.usersGetCurrentAccount(undefined as any, { signal } as any)).result);
  }

  listFolder(args: { path: string; recursive?: boolean; limit?: number; cursor?: string }) {
    if (args.cursor) return this.read(async signal => (await this.dbx.filesListFolderContinue({ cursor: args.cursor }, { signal } as any)).result);
    return this.read(async signal => (await this.dbx.filesListFolder({
      path: args.path,
      recursive: args.recursive ?? false,
      limit: args.limit ?? 100
    } as any, { signal } as any)).result);
  }

  getMetadata(path: string) {
    return this.read(async signal => (await this.dbx.filesGetMetadata({ path } as any, { signal } as any)).result);
  }

  search(args: { query: string; path?: string; maxResults?: number }) {
    return this.read(async signal => (await this.dbx.filesSearchV2({
      query: args.query,
      options: { path: args.path, max_results: args.maxResults ?? 20, filename_only: false }
    } as any, { signal } as any)).result);
  }

  createFolder(path: string) {
    return this.write(async signal => (await this.dbx.filesCreateFolderV2({ path, autorename: false } as any, { signal } as any)).result);
  }

  createTextFile(path: string, content: string, autorename = false) {
    return this.write(async signal => (await this.dbx.filesUpload({
      path,
      contents: Buffer.from(content, 'utf8'),
      mode: { '.tag': 'add' },
      autorename,
      mute: false
    } as any, { signal } as any)).result);
  }

  copy(fromPath: string, toPath: string, autorename = false) {
    return this.write(async signal => (await this.dbx.filesCopyV2({ from_path: fromPath, to_path: toPath, autorename } as any, { signal } as any)).result);
  }

  move(fromPath: string, toPath: string, autorename = false) {
    return this.write(async signal => (await this.dbx.filesMoveV2({ from_path: fromPath, to_path: toPath, autorename } as any, { signal } as any)).result);
  }

  delete(path: string, parentRev?: string) {
    return this.write(async signal => (await this.dbx.filesDeleteV2({ path, parent_rev: parentRev } as any, { signal } as any)).result);
  }

  createSharedLink(path: string, audience: 'public' | 'team' | 'no_one' = 'public') {
    return this.write(async signal => (await this.dbx.sharingCreateSharedLinkWithSettings({
      path,
      settings: { requested_visibility: { '.tag': audience } }
    } as any, { signal } as any)).result);
  }

  listSharedLinks(path?: string, cursor?: string) {
    if (cursor) return this.read(async signal => (await this.dbx.sharingListSharedLinks({ cursor } as any, { signal } as any)).result);
    return this.read(async signal => (await this.dbx.sharingListSharedLinks({ path, direct_only: Boolean(path) } as any, { signal } as any)).result);
  }

  listRevisions(path: string, limit = 20) {
    return this.read(async signal => (await this.dbx.filesListRevisions({ path, limit, mode: { '.tag': 'path' } } as any, { signal } as any)).result);
  }

  restoreRevision(path: string, rev: string) {
    return this.write(async signal => (await this.dbx.filesRestore({ path, rev } as any, { signal } as any)).result);
  }
}
