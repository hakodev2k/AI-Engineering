import test from "node:test";
import assert from "node:assert/strict";
import { HibpClient, HibpError } from "../src/client.js";
import { loadConfig } from "../src/config.js";
import { assertAllowed, TOOL_POLICIES } from "../src/policy.js";
import { TOOL_NAMES } from "../src/tools.js";

const baseConfig = {
  apiKey: "test-key",
  userAgent: "hibp-test",
  timeoutMs: 50,
  maxRetries: 1,
  useOfficialMcp: false,
  apiBaseUrl: "https://haveibeenpwned.com/api/v3",
  passwordsBaseUrl: "https://api.pwnedpasswords.com",
  mcpUrl: "https://haveibeenpwned.com/mcp"
};

test("config applies safe defaults and isolates optional API key", () => {
  const config = loadConfig({ HIBP_USER_AGENT: "my-agent" });
  assert.equal(config.userAgent, "my-agent");
  assert.equal(config.apiKey, undefined);
  assert.equal(config.maxRetries, 2);
  assert.equal(config.useOfficialMcp, true);
});

test("exactly ten scoped read tools are registered in policy metadata", () => {
  assert.equal(TOOL_NAMES.length, 10);
  for (const name of TOOL_NAMES) {
    assert.equal(TOOL_POLICIES[name].risk, "READ");
    assert.equal(TOOL_POLICIES[name].approvalRequired, false);
  }
});

test("permission allowlist denies a missing capability", () => {
  assert.throws(() => assertAllowed("hibp.account.breaches", new Set(["breach:read"])), /Permission denied/);
});

test("protected operations reject missing API key before network access", async () => {
  const client = new HibpClient({ ...baseConfig, apiKey: undefined }, async () => {
    throw new Error("network should not be called");
  });
  await assert.rejects(() => client.breachedAccount("test@example.com"), (error: unknown) => {
    return error instanceof HibpError && error.status === 401;
  });
});

test("404 account search maps to an empty result", async () => {
  const client = new HibpClient(baseConfig, async () => new Response("not found", { status: 404 }));
  assert.deepEqual(await client.breachedAccount("nobody@example.com"), []);
});

test("authenticated requests include API key and user agent", async () => {
  let headers: Headers | undefined;
  const client = new HibpClient(baseConfig, async (_input, init) => {
    headers = new Headers(init?.headers);
    return Response.json([{ Name: "Adobe" }]);
  });
  await client.breachedAccount("test@example.com");
  assert.equal(headers?.get("hibp-api-key"), "test-key");
  assert.equal(headers?.get("user-agent"), "hibp-test");
});

test("429 is retried in a bounded manner", async () => {
  let calls = 0;
  const client = new HibpClient({ ...baseConfig, maxRetries: 1 }, async () => {
    calls++;
    if (calls === 1) return new Response("slow down", { status: 429, headers: { "retry-after": "0" } });
    return Response.json([{ Name: "Adobe" }]);
  });
  const result = await client.breachedAccount("test@example.com");
  assert.equal(calls, 2);
  assert.deepEqual(result, [{ Name: "Adobe" }]);
});

test("MCP-disabled public lookup falls back to REST", async () => {
  let requested = "";
  const client = new HibpClient(baseConfig, async (input) => {
    requested = String(input);
    return Response.json({ Name: "Adobe" });
  });
  const result = await client.getBreach("Adobe");
  assert.match(requested, /\/breach\/Adobe$/);
  assert.deepEqual(result, { Name: "Adobe" });
});

test("Pwned Passwords fallback parses range and sends padding header", async () => {
  let addPadding: string | null = null;
  const client = new HibpClient(baseConfig, async (_input, init) => {
    addPadding = new Headers(init?.headers).get("Add-Padding");
    return new Response("ABCDEF:42\r\n123456:7\r\n", { status: 200 });
  });
  const result = await client.pwnedPasswordRange("21bd1", "sha1", true);
  assert.equal(addPadding, "true");
  assert.deepEqual(result, [{ suffix: "ABCDEF", count: 42 }, { suffix: "123456", count: 7 }]);
});

test("timeout is mapped to a connector error", async () => {
  const client = new HibpClient({ ...baseConfig, timeoutMs: 5, maxRetries: 0 }, async (_input, init) => {
    return await new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    });
  });
  await assert.rejects(() => client.breachedAccount("test@example.com"), /timed out/);
});
