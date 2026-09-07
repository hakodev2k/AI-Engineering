import { z } from "zod";
import type { CORSRule } from "@aws-sdk/client-s3";
import type { BackblazeClient } from "./client.js";
import type { BackblazeConfig } from "./config.js";
import { assertPolicy, type Risk } from "./policy.js";

const bucketName = z.string().min(6).max(63).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/);
const objectKey = z.string().min(1).max(1024).refine(v => !/[\u0000-\u001f\u007f]/.test(v), "Object key contains control characters");
const approved = z.boolean().default(false);
const expires = z.number().int().min(60).max(3600).default(900);

const corsRule = z.object({
  AllowedHeaders: z.array(z.string().min(1).max(256)).max(50).optional(),
  AllowedMethods: z.array(z.enum(["GET", "PUT", "POST", "DELETE", "HEAD"])).min(1).max(5),
  AllowedOrigins: z.array(z.string().url()).min(1).max(50),
  ExposeHeaders: z.array(z.string().min(1).max(256)).max(50).optional(),
  MaxAgeSeconds: z.number().int().min(0).max(86400).optional()
}).strict();

export type ToolSpec = {
  name: string;
  description: string;
  risk: Risk;
  permission: string;
  approval: "none" | "configurable" | "required";
  schema: z.ZodTypeAny;
  run: (client: BackblazeClient, config: BackblazeConfig, input: any) => Promise<unknown>;
};

function withPolicy(risk: Risk, fn: (client: BackblazeClient, input: any) => Promise<unknown>) {
  return async (client: BackblazeClient, config: BackblazeConfig, input: any) => {
    assertPolicy(config, risk, Boolean(input.approved));
    return fn(client, input);
  };
}

export const TOOL_SPECS: ToolSpec[] = [
  {
    name: "backblaze.bucket.list",
    description: "List Backblaze B2 buckets visible to the configured application key.",
    risk: "READ", permission: "listBuckets/listAllBucketNames", approval: "none",
    schema: z.object({}).strict(),
    run: withPolicy("READ", c => c.listBuckets())
  },
  {
    name: "backblaze.bucket.get",
    description: "Check whether a named B2 bucket is accessible.",
    risk: "READ", permission: "listBuckets", approval: "none",
    schema: z.object({ bucket: bucketName }).strict(),
    run: withPolicy("READ", (c, i) => c.getBucket(i.bucket))
  },
  {
    name: "backblaze.bucket.create",
    description: "Create a B2 bucket in the configured region.",
    risk: "WRITE", permission: "writeBuckets", approval: "configurable",
    schema: z.object({ bucket: bucketName, approved }).strict(),
    run: withPolicy("WRITE", (c, i) => c.createBucket(i.bucket))
  },
  {
    name: "backblaze.bucket.delete",
    description: "Delete an empty B2 bucket.",
    risk: "DESTRUCTIVE", permission: "deleteBuckets", approval: "required",
    schema: z.object({ bucket: bucketName, approved }).strict(),
    run: withPolicy("DESTRUCTIVE", (c, i) => c.deleteBucket(i.bucket))
  },
  {
    name: "backblaze.object.list",
    description: "List objects in a bucket with bounded pagination.",
    risk: "READ", permission: "listFiles", approval: "none",
    schema: z.object({ bucket: bucketName, prefix: z.string().max(1024).optional(), continuationToken: z.string().max(4096).optional(), maxKeys: z.number().int().min(1).max(1000).default(100) }).strict(),
    run: withPolicy("READ", (c, i) => c.listObjects(i.bucket, i.prefix, i.continuationToken, i.maxKeys))
  },
  {
    name: "backblaze.object.get_metadata",
    description: "Read object metadata without downloading object content.",
    risk: "READ", permission: "readFiles", approval: "none",
    schema: z.object({ bucket: bucketName, key: objectKey }).strict(),
    run: withPolicy("READ", (c, i) => c.getObjectMetadata(i.bucket, i.key))
  },
  {
    name: "backblaze.object.create_download_url",
    description: "Create a short-lived SigV4 pre-signed download URL for an object.",
    risk: "READ", permission: "readFiles", approval: "none",
    schema: z.object({ bucket: bucketName, key: objectKey, expiresInSeconds: expires }).strict(),
    run: withPolicy("READ", (c, i) => c.createDownloadUrl(i.bucket, i.key, i.expiresInSeconds))
  },
  {
    name: "backblaze.object.create_upload_url",
    description: "Create a short-lived SigV4 pre-signed upload URL for one exact object key.",
    risk: "WRITE", permission: "writeFiles", approval: "configurable",
    schema: z.object({ bucket: bucketName, key: objectKey, contentType: z.string().min(1).max(255).optional(), expiresInSeconds: expires, approved }).strict(),
    run: withPolicy("WRITE", (c, i) => c.createUploadUrl(i.bucket, i.key, i.expiresInSeconds, i.contentType))
  },
  {
    name: "backblaze.object.copy",
    description: "Copy an existing object to an exact destination bucket/key.",
    risk: "WRITE", permission: "readFiles+writeFiles", approval: "configurable",
    schema: z.object({ sourceBucket: bucketName, sourceKey: objectKey, destinationBucket: bucketName, destinationKey: objectKey, approved }).strict(),
    run: withPolicy("WRITE", (c, i) => c.copyObject(i.sourceBucket, i.sourceKey, i.destinationBucket, i.destinationKey))
  },
  {
    name: "backblaze.object.delete",
    description: "Delete the current object version addressed by bucket and key.",
    risk: "DESTRUCTIVE", permission: "writeFiles+deleteFiles", approval: "required",
    schema: z.object({ bucket: bucketName, key: objectKey, approved }).strict(),
    run: withPolicy("DESTRUCTIVE", (c, i) => c.deleteObject(i.bucket, i.key))
  },
  {
    name: "backblaze.bucket.cors.get",
    description: "Read the bucket CORS configuration.",
    risk: "READ", permission: "readBuckets", approval: "none",
    schema: z.object({ bucket: bucketName }).strict(),
    run: withPolicy("READ", (c, i) => c.getBucketCors(i.bucket))
  },
  {
    name: "backblaze.bucket.cors.set",
    description: "Replace the bucket CORS configuration with an explicit bounded rule set.",
    risk: "HIGH_RISK", permission: "writeBuckets", approval: "required",
    schema: z.object({ bucket: bucketName, rules: z.array(corsRule).min(1).max(100), approved }).strict(),
    run: withPolicy("HIGH_RISK", (c, i) => c.setBucketCors(i.bucket, i.rules as CORSRule[]))
  },
  {
    name: "backblaze.bucket.cors.delete",
    description: "Remove the bucket CORS configuration.",
    risk: "DESTRUCTIVE", permission: "writeBuckets", approval: "required",
    schema: z.object({ bucket: bucketName, approved }).strict(),
    run: withPolicy("DESTRUCTIVE", (c, i) => c.deleteBucketCors(i.bucket))
  }
];
