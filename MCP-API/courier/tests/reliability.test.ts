import test from "node:test";
import assert from "node:assert/strict";
import { callWithReadRetry, classifyProviderError, withTimeout } from "../src/reliability.js";

test("read retry is bounded", async () => {
  let calls = 0;
  await assert.rejects(() => callWithReadRetry(async () => {
    calls += 1;
    throw new Error("503 temporary");
  }, 2));
  assert.equal(calls, 3);
});

test("non-retryable failures are not retried", async () => {
  let calls = 0;
  await assert.rejects(() => callWithReadRetry(async () => {
    calls += 1;
    throw new Error("400 validation");
  }, 3));
  assert.equal(calls, 1);
});

test("maps authentication and throttling errors", () => {
  assert.match(classifyProviderError(new Error("401 unauthorized")).message, /authentication failed/);
  assert.match(classifyProviderError(new Error("429 rate limit")).message, /rate limit/);
});

test("timeout rejects bounded call", async () => {
  await assert.rejects(() => withTimeout(new Promise(() => {}), 5), /timed out/);
});
