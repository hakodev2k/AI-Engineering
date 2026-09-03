import test from "node:test";
import assert from "node:assert/strict";
import { withTimeout } from "../src/upstream.js";

test("withTimeout returns a completed result", async () => {
  const result = await withTimeout(Promise.resolve("ok"), 1000);
  assert.equal(result, "ok");
});

test("withTimeout rejects a stalled operation", async () => {
  await assert.rejects(
    withTimeout(new Promise<never>(() => {}), 5),
    /timed out/
  );
});
