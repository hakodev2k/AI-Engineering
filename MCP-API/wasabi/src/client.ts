import {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Config } from './config.js';

export class WasabiError extends Error {
  constructor(message: string, public readonly code = 'WASABI_ERROR', public readonly retryAfterSeconds?: number) {
    super(message);
  }
}

export class WasabiClient {
  private readonly s3: S3Client;

  constructor(private readonly config: Config) {
    this.s3 = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
      maxAttempts: 1
    });
  }

  private async call<T>(fn: (abortSignal: AbortSignal) => Promise<T>, retryable: boolean): Promise<T> {
    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      try {
        return await fn(controller.signal);
      } catch (error: any) {
        const status = error?.$metadata?.httpStatusCode;
        const transient = status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || error?.name === 'TimeoutError' || error?.name === 'AbortError';
        if (!retryable || !transient || attempt >= this.config.maxRetries) {
          throw new WasabiError(error?.message ?? 'Wasabi request failed', status === 429 ? 'RATE_LIMITED' : 'PROVIDER_ERROR');
        }
        await new Promise(r => setTimeout(r, Math.min(4000, 250 * 2 ** attempt)));
        attempt += 1;
      } finally {
        clearTimeout(timer);
      }
    }
  }

  async listBuckets() {
    return this.call(signal => this.s3.send(new ListBucketsCommand({}), { abortSignal: signal }), true);
  }

  async bucketLocation(bucket: string) {
    return this.call(signal => this.s3.send(new GetBucketLocationCommand({ Bucket: bucket }), { abortSignal: signal }), true);
  }

  async createBucket(bucket: string) {
    const input: any = { Bucket: bucket };
    if (this.config.region !== 'us-east-1') input.CreateBucketConfiguration = { LocationConstraint: this.config.region };
    return this.call(signal => this.s3.send(new CreateBucketCommand(input), { abortSignal: signal }), false);
  }

  async deleteBucket(bucket: string) {
    return this.call(signal => this.s3.send(new DeleteBucketCommand({ Bucket: bucket }), { abortSignal: signal }), false);
  }

  async listObjects(bucket: string, prefix?: string, maxKeys = 100, continuationToken?: string) {
    return this.call(signal => this.s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: maxKeys, ContinuationToken: continuationToken }), { abortSignal: signal }), true);
  }

  async headObject(bucket: string, key: string) {
    return this.call(signal => this.s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }), { abortSignal: signal }), true);
  }

  async readText(bucket: string, key: string, maxBytes: number) {
    const result = await this.call(signal => this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=0-${maxBytes - 1}` }), { abortSignal: signal }), true);
    const text = result.Body ? await result.Body.transformToString('utf-8') : '';
    return { ...result, Body: undefined, text, truncatedByConnector: (result.ContentLength ?? 0) > maxBytes };
  }

  async putText(bucket: string, key: string, content: string, contentType?: string) {
    return this.call(signal => this.s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: content, ContentType: contentType }), { abortSignal: signal }), false);
  }

  async copyObject(bucket: string, sourceKey: string, destinationKey: string) {
    const encoded = `${bucket}/${sourceKey.split('/').map(encodeURIComponent).join('/')}`;
    return this.call(signal => this.s3.send(new CopyObjectCommand({ Bucket: bucket, CopySource: encoded, Key: destinationKey }), { abortSignal: signal }), false);
  }

  async deleteObject(bucket: string, key: string, versionId?: string) {
    return this.call(signal => this.s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key, VersionId: versionId }), { abortSignal: signal }), false);
  }

  async presignGet(bucket: string, key: string, expiresIn: number) {
    return { url: await getSignedUrl(this.s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn }) };
  }

  async presignPut(bucket: string, key: string, expiresIn: number, contentType?: string) {
    return { url: await getSignedUrl(this.s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn }) };
  }
}
