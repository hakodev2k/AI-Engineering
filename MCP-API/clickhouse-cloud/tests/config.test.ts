import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

const good = { CLICKHOUSE_CLOUD_API_KEY: "kid", CLICKHOUSE_CLOUD_API_SECRET: "secret", CLICKHOUSE_CLOUD_ORG_ID: "123e4567-e89b-12d3-a456-426614174000", CLICKHOUSE_HOST: "example.clickhouse.cloud", CLICKHOUSE_PASSWORD: "pw" } as NodeJS.ProcessEnv;

test("loads secure defaults", () => {
  const c = loadConfig(good);
  assert.equal(c.secure, true); assert.equal(c.verify, true); assert.equal(c.port, 8443);
});

test("rejects missing credentials", () => assert.throws(() => loadConfig({} as NodeJS.ProcessEnv)));
test("rejects invalid organization id", () => assert.throws(() => loadConfig({ ...good, CLICKHOUSE_CLOUD_ORG_ID: "bad" } as NodeJS.ProcessEnv)));
