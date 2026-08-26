import {
  S3Client, ListBucketsCommand, HeadBucketCommand, ListObjectsV2Command, ListObjectVersionsCommand,
  HeadObjectCommand, GetObjectCommand, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Config } from './config.js';
import { assertResourceAllowed } from './config.js';

export class BackblazeClient {
  readonly s3: S3Client;
  constructor(private readonly config: Config) {
    this.s3 = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId: config.keyId, secretAccessKey: config.applicationKey },
      maxAttempts: 3
    });
  }

  private async send<T>(command: any): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try { return await this.s3.send(command, { abortSignal: controller.signal }) as T; }
    catch (error: any) {
      const status = error?.$metadata?.httpStatusCode;
      const requestId = error?.$metadata?.requestId;
      if (status === 401 || status === 403) throw new Error(`Backblaze authorization denied${requestId ? ` (request ${requestId})` : ''}`);
      if (status === 429) throw new Error(`Backblaze rate limit exceeded${requestId ? ` (request ${requestId})` : ''}`);
      if (error?.name === 'AbortError') throw new Error('Backblaze request timed out');
      throw error;
    } finally { clearTimeout(timer); }
  }

  async listBuckets() {
    const out: any = await this.send(new ListBucketsCommand({}));
    const buckets = (out.Buckets ?? []).filter((b: any) => !this.config.allowedBuckets.size || this.config.allowedBuckets.has(b.Name));
    return buckets.map((b: any) => ({ name: b.Name, creationDate: b.CreationDate?.toISOString?.() ?? b.CreationDate }));
  }

  async headBucket(bucket: string) {
    assertResourceAllowed(this.config, bucket);
    const out: any = await this.send(new HeadBucketCommand({ Bucket: bucket }));
    return { bucket, region: out.BucketRegion ?? this.config.region };
  }

  async listObjects(bucket: string, prefix = '', continuationToken?: string, maxKeys = 100) {
    assertResourceAllowed(this.config, bucket, prefix || undefined);
    const out: any = await this.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix || undefined, ContinuationToken: continuationToken, MaxKeys: maxKeys }));
    return {
      objects: (out.Contents ?? []).map((o: any) => ({ key: o.Key, size: o.Size, etag: o.ETag, lastModified: o.LastModified?.toISOString?.() ?? o.LastModified })),
      prefixes: (out.CommonPrefixes ?? []).map((p: any) => p.Prefix),
      nextContinuationToken: out.NextContinuationToken,
      truncated: !!out.IsTruncated
    };
  }

  async listVersions(bucket: string, prefix = '', keyMarker?: string, versionIdMarker?: string, maxKeys = 100) {
    assertResourceAllowed(this.config, bucket, prefix || undefined);
    const out: any = await this.send(new ListObjectVersionsCommand({ Bucket: bucket, Prefix: prefix || undefined, KeyMarker: keyMarker, VersionIdMarker: versionIdMarker, MaxKeys: maxKeys }));
    return {
      versions: (out.Versions ?? []).map((v: any) => ({ key: v.Key, versionId: v.VersionId, isLatest: v.IsLatest, size: v.Size, etag: v.ETag, lastModified: v.LastModified?.toISOString?.() ?? v.LastModified })),
      deleteMarkers: (out.DeleteMarkers ?? []).map((v: any) => ({ key: v.Key, versionId: v.VersionId, isLatest: v.IsLatest, lastModified: v.LastModified?.toISOString?.() ?? v.LastModified })),
      nextKeyMarker: out.NextKeyMarker,
      nextVersionIdMarker: out.NextVersionIdMarker,
      truncated: !!out.IsTruncated
    };
  }

  async headObject(bucket: string, key: string, versionId?: string) {
    assertResourceAllowed(this.config, bucket, key);
    const out: any = await this.send(new HeadObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
    return { bucket, key, versionId: out.VersionId ?? versionId, contentLength: out.ContentLength, contentType: out.ContentType, etag: out.ETag, lastModified: out.LastModified?.toISOString?.() ?? out.LastModified, metadata: out.Metadata ?? {} };
  }

  async readText(bucket: string, key: string, versionId?: string) {
    assertResourceAllowed(this.config, bucket, key);
    const meta = await this.headObject(bucket, key, versionId);
    if ((meta.contentLength ?? 0) > this.config.maxReadBytes) throw new Error(`Object exceeds B2_MAX_READ_BYTES (${this.config.maxReadBytes})`);
    const out: any = await this.send(new GetObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
    const text = await out.Body.transformToString('utf-8');
    return { ...meta, text, untrustedContent: true };
  }

  async presignDownload(bucket: string, key: string, expiresIn: number, versionId?: string) {
    assertResourceAllowed(this.config, bucket, key);
    const url = await getSignedUrl(this.s3, new GetObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }), { expiresIn });
    return { url, expiresIn };
  }

  async presignUpload(bucket: string, key: string, expiresIn: number, contentType?: string) {
    assertResourceAllowed(this.config, bucket, key);
    const url = await getSignedUrl(this.s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn });
    return { url, expiresIn, method: 'PUT' };
  }

  async writeText(bucket: string, key: string, text: string, contentType = 'text/plain; charset=utf-8') {
    assertResourceAllowed(this.config, bucket, key);
    const out: any = await this.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: Buffer.from(text, 'utf8'), ContentType: contentType }));
    return { bucket, key, etag: out.ETag, versionId: out.VersionId };
  }

  async copyObject(sourceBucket: string, sourceKey: string, destinationBucket: string, destinationKey: string) {
    assertResourceAllowed(this.config, sourceBucket, sourceKey);
    assertResourceAllowed(this.config, destinationBucket, destinationKey);
    const source = encodeURIComponent(`${sourceBucket}/${sourceKey}`).replace(/%2F/g, '/');
    const out: any = await this.send(new CopyObjectCommand({ Bucket: destinationBucket, Key: destinationKey, CopySource: source }));
    return { sourceBucket, sourceKey, destinationBucket, destinationKey, etag: out.CopyObjectResult?.ETag, versionId: out.VersionId };
  }

  async deleteObject(bucket: string, key: string, versionId?: string) {
    assertResourceAllowed(this.config, bucket, key);
    const out: any = await this.send(new DeleteObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }));
    return { bucket, key, requestedVersionId: versionId, deletedVersionId: out.VersionId, deleteMarker: out.DeleteMarker ?? false };
  }
}
