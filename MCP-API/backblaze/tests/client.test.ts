import test from "node:test";
import assert from "node:assert/strict";
import { BackblazeClient, BackblazeApiError } from "../src/client.js";
import type { BackblazeConfig } from "../src/config.js";

const config: BackblazeConfig = {
  keyId: "id",
  applicationKey: "secret",
  region: "us-east-005",
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  allowWrite: true,
  allowDestructive: true,
  writeApprovalRequired: true,
  requestTimeoutMs: 1000,
  maxAttempts: 3
};

test("listObjects forwards bounded pagination fields", async () => {
  let input: any;
  const sender = { send: async (command: any) => { input = command.input; return { Contents: [], IsTruncated: true, NextContinuationToken: "next" }; } };
  const client = new BackblazeClient(config, sender);
  const result = await client.listObjects("bucket1", "logs/", "cursor", 25);
  assert.equal(input.Bucket, "bucket1");
  assert.equal(input.Prefix, "logs/");
  assert.equal(input.ContinuationToken, "cursor");
  assert.equal(input.MaxKeys, 25);
  assert.equal(result.nextContinuationToken, "next");
});

test("retryable 503 is retried for read operations", async () => {
  let calls = 0;
  const sender = { send: async () => {
    calls++;
    if (calls === 1) {
      const e: any = new Error("slow down");
      e.name = "SlowDown";
      e.$metadata = { httpStatusCode: 503 };
      throw e;
    }
    return { Buckets: [] };
  } };
  const client = new BackblazeClient(config, sender);
  await client.listBuckets();
  assert.equal(calls, 2);
});

test("authentication failures are not retried", async () => {
  let calls = 0;
  const sender = { send: async () => {
    calls++;
    const e: any = new Error("forbidden");
    e.name = "AccessDenied";
    e.$metadata = { httpStatusCode: 403 };
    throw e;
  } };
  const client = new BackblazeClient(config, sender);
  await assert.rejects(() => client.listBuckets(), BackblazeApiError);
  assert.equal(calls, 1);
});

test("destructive operations are never blindly retried", async () => {
  let calls = 0;
  const sender = { send: async () => {
    calls++;
    const e: any = new Error("slow down");
    e.name = "SlowDown";
    e.$metadata = { httpStatusCode: 503 };
    throw e;
  } };
  const client = new BackblazeClient(config, sender);
  await assert.rejects(() => client.deleteObject("bucket1", "a.txt"), BackblazeApiError);
  assert.equal(calls, 1);
});
