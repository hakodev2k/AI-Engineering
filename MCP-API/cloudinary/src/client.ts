import { v2 as cloudinary } from 'cloudinary';
import type { ConnectorConfig } from './config.js';
import { configureCloudinary } from './config.js';

export class CloudinaryClient {
  private sdk: typeof cloudinary;
  constructor(private config: ConnectorConfig) { this.sdk = configureCloudinary(config); }

  private async run<T>(fn: () => Promise<T>, retryable = true): Promise<T> {
    let last: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await Promise.race([
          fn(),
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Cloudinary request timed out')), this.config.timeoutMs))
        ]);
      } catch (err: any) {
        last = err;
        const status = err?.http_code ?? err?.statusCode;
        if (!retryable || [400,401,403,404,409,422].includes(status) || attempt === this.config.maxRetries) throw err;
        const waitMs = Math.min(4000, 250 * 2 ** attempt) + Math.floor(Math.random() * 150);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
    throw last;
  }

  listAssets(params: any) { return this.run(() => this.sdk.api.resources({ resource_type: params.resourceType ?? 'image', type: params.type ?? 'upload', max_results: params.maxResults ?? 50, next_cursor: params.nextCursor })); }
  getAsset(publicId: string, resourceType = 'image', type = 'upload') { return this.run(() => this.sdk.api.resource(publicId, { resource_type: resourceType, type })); }
  searchAssets(expression: string, maxResults = 50, nextCursor?: string) { return this.run(async () => { let q = this.sdk.search.expression(expression).max_results(maxResults); if (nextCursor) q = q.next_cursor(nextCursor); return q.execute(); }); }
  listFolders() { return this.run(() => this.sdk.api.root_folders()); }
  listTags(resourceType = 'image', maxResults = 100, nextCursor?: string) { return this.run(() => this.sdk.api.tags({ resource_type: resourceType, max_results: maxResults, next_cursor: nextCursor })); }
  usage() { return this.run(() => this.sdk.api.usage()); }
  upload(file: string, options: any) { return this.run(() => this.sdk.uploader.upload(file, options), false); }
  updateAsset(publicId: string, options: any, resourceType = 'image', type = 'upload') { return this.run(() => this.sdk.uploader.explicit(publicId, { ...options, resource_type: resourceType, type }), false); }
  renameAsset(fromPublicId: string, toPublicId: string, resourceType = 'image', type = 'upload') { return this.run(() => this.sdk.uploader.rename(fromPublicId, toPublicId, { resource_type: resourceType, type, overwrite: false }), false); }
  deleteAsset(publicId: string, resourceType = 'image', type = 'upload') { return this.run(() => this.sdk.uploader.destroy(publicId, { resource_type: resourceType, type, invalidate: true }), false); }
  buildUrl(publicId: string, resourceType = 'image', transformation?: any) { return this.sdk.url(publicId, { secure: true, resource_type: resourceType, transformation }); }
}
