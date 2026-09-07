import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteBucketCorsCommand,
  DeleteObjectCommand,
  GetBucketCorsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
  type CORSRule,
  type S3ClientConfig
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { BackblazeConfig } from "./config.js";

export class BackblazeApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "BackblazeApiError";
  }
}

type Sender = { send(command: unknown, options?: { abortSignal?: AbortSignal }): Promise<any> };

type RequestOptions = { destructive?: boolean };

function retryAfter(error: any): number | undefined {
  const raw = error?.$response?.headers?.["retry-after"] ?? error?.$response?.headers?.get?.("retry-after");
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function statusOf(error: any): number | undefined {
  return error?.$metadata?.httpStatusCode ?? error?.statusCode;
}

function codeOf(error: any): string | undefined {
  return error?.name ?? error?.Code ?? error?.code;
}

function isRetryable(error: any): boolean {
  const status = statusOf(error);
  const code = codeOf(error);
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || code === "SlowDown";
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BackblazeClient {
  private readonly s3: Sender;

  constructor(private readonly config: BackblazeConfig, sender?: Sender) {
    const s3Config: S3ClientConfig = {
      endpoint: config.endpoint,
      region: config.region,
      credentials: { accessKeyId: config.keyId, secretAccessKey: config.applicationKey },
      forcePathStyle: true,
      maxAttempts: 1
    };
    this.s3 = sender ?? new S3Client(s3Config);
  }

  private async request(command: unknown, options: RequestOptions = {}): Promise<any> {
    const attempts = options.destructive ? 1 : this.config.maxAttempts;
    let last: any;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);
      try {
        return await this.s3.send(command, { abortSignal: controller.signal });
      } catch (error: any) {
        last = error;
        const status = statusOf(error);
        if (status === 401 || status === 403 || !isRetryable(error) || attempt === attempts) break;
        const retrySeconds = retryAfter(error);
        const delay = retrySeconds !== undefined ? retrySeconds * 1000 : Math.min(250 * 2 ** (attempt - 1), 4000);
        await sleep(delay);
      } finally {
        clearTimeout(timeout);
      }
    }
    if (last?.name === "AbortError") throw new BackblazeApiError("Backblaze request timed out", 408, "timeout");
    throw new BackblazeApiError(last?.message ?? "Backblaze request failed", statusOf(last), codeOf(last), retryAfter(last));
  }

  async listBuckets() {
    const r = await this.request(new ListBucketsCommand({}));
    return (r.Buckets ?? []).map((b: any) => ({ name: b.Name, createdAt: b.CreationDate?.toISOString?.() ?? b.CreationDate }));
  }

  async getBucket(bucket: string) {
    await this.request(new HeadBucketCommand({ Bucket: bucket }));
    return { bucket, exists: true };
  }

  async createBucket(bucket: string) {
    await this.request(new CreateBucketCommand({ Bucket: bucket }));
    return { bucket, created: true };
  }

  async deleteBucket(bucket: string) {
    await this.request(new DeleteBucketCommand({ Bucket: bucket }), { destructive: true });
    return { bucket, deleted: true };
  }

  async listObjects(bucket: string, prefix?: string, continuationToken?: string, maxKeys = 100) {
    const r = await this.request(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken, MaxKeys: maxKeys }));
    return {
      items: (r.Contents ?? []).map((o: any) => ({ key: o.Key, size: o.Size, etag: o.ETag, lastModified: o.LastModified?.toISOString?.() ?? o.LastModified })),
      nextContinuationToken: r.NextContinuationToken,
      truncated: Boolean(r.IsTruncated)
    };
  }

  async getObjectMetadata(bucket: string, key: string) {
    const r = await this.request(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return {
      bucket,
      key,
      contentLength: r.ContentLength,
      contentType: r.ContentType,
      etag: r.ETag,
      lastModified: r.LastModified?.toISOString?.() ?? r.LastModified,
      metadata: r.Metadata ?? {}
    };
  }

  async createDownloadUrl(bucket: string, key: string, expiresInSeconds: number) {
    const url = await getSignedUrl(this.s3 as S3Client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: expiresInSeconds });
    return { bucket, key, expiresInSeconds, url };
  }

  async createUploadUrl(bucket: string, key: string, expiresInSeconds: number, contentType?: string) {
    const url = await getSignedUrl(this.s3 as S3Client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn: expiresInSeconds });
    return { bucket, key, expiresInSeconds, contentType, url };
  }

  async copyObject(sourceBucket: string, sourceKey: string, destinationBucket: string, destinationKey: string) {
    const escapedKey = encodeURIComponent(sourceKey).replace(/%2F/g, "/");
    const r = await this.request(new CopyObjectCommand({
      Bucket: destinationBucket,
      Key: destinationKey,
      CopySource: `/${sourceBucket}/${escapedKey}`
    }));
    return { sourceBucket, sourceKey, destinationBucket, destinationKey, etag: r.CopyObjectResult?.ETag };
  }

  async deleteObject(bucket: string, key: string) {
    await this.request(new DeleteObjectCommand({ Bucket: bucket, Key: key }), { destructive: true });
    return { bucket, key, deleted: true };
  }

  async getBucketCors(bucket: string) {
    try {
      const r = await this.request(new GetBucketCorsCommand({ Bucket: bucket }));
      return { bucket, rules: r.CORSRules ?? [] };
    } catch (error) {
      if (error instanceof BackblazeApiError && error.code === "NoSuchCORSConfiguration") return { bucket, rules: [] };
      throw error;
    }
  }

  async setBucketCors(bucket: string, rules: CORSRule[]) {
    await this.request(new PutBucketCorsCommand({ Bucket: bucket, CORSConfiguration: { CORSRules: rules } }));
    return { bucket, updated: true, ruleCount: rules.length };
  }

  async deleteBucketCors(bucket: string) {
    await this.request(new DeleteBucketCorsCommand({ Bucket: bucket }), { destructive: true });
    return { bucket, corsDeleted: true };
  }
}
