import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadConfig } from "../src/config.js";
import { CredentialProvider } from "../src/credentials.js";
import { MiroClient, MiroError } from "../src/client.js";
import { approvalDigest, authorize, POLICY } from "../src/policy.js";
import { TOOLS } from "../src/tools.js";
import { sanitize } from "../src/sanitize.js";

test("tool registry and policy are complete", () => {
  assert.equal(TOOLS.length, 15);
  assert.deepEqual(TOOLS.map((x) => x.name).sort(), Object.keys(POLICY).sort());
});

test("configuration requires exactly one credential mode", () => {
  assert.throws(() => loadConfig({}), /MIRO_ACCESS_TOKEN/);
  assert.throws(() => loadConfig({MIRO_ACCESS_TOKEN: "a", MIRO_TOKEN_FILE: "b"}), /only one/);
  assert.equal(loadConfig({MIRO_ACCESS_TOKEN: "a"}).apiBaseUrl, "https://api.miro.com");
});

test("write approval is payload-bound", () => {
  const config = {approvalSecret: "secret", destructiveEnabled: false};
  const payload = {boardId: "b", data: {content: "x"}};
  const token = approvalDigest(config.approvalSecret, "miro.text.create", payload);
  assert.doesNotThrow(() => authorize(config, "miro.text.create", payload, token));
  assert.throws(() => authorize(config, "miro.text.create", {...payload, boardId: "other"}, token), /Invalid/);
});

test("destructive tools are disabled by default", () => {
  assert.throws(
    () => authorize({approvalSecret: "s", destructiveEnabled: false}, "miro.text.delete", {boardId: "b", itemId: "i"}, "0".repeat(64)),
    /disabled/
  );
});

test("sanitizer redacts credential-shaped response keys", () => {
  const result = sanitize({accessToken: "x", nested: {client_secret: "y"}, ok: 1});
  assert.equal(result.accessToken, "[REDACTED]");
  assert.equal(result.nested.client_secret, "[REDACTED]");
  assert.equal(result.ok, 1);
});

test("client uses Bearer auth and encodes path identifiers", async () => {
  let seen;
  const fetchImpl = async (url, init) => {
    seen = {url: String(url), init};
    return new Response(JSON.stringify({id: "x"}), {status: 200});
  };
  const credentials = {getAccessToken: async () => "abc"};
  const client = new MiroClient({apiBaseUrl: "https://api.miro.com", timeoutMs: 1000, maxRetries: 0}, credentials, fetchImpl);
  await client.getBoard({boardId: "a/b"});
  assert.match(seen.url, /a%2Fb/);
  assert.equal(seen.init.headers.Authorization, "Bearer abc");
});

test("safe GET retries 429 and preserves bounded behavior", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) return new Response(JSON.stringify({message: "rate"}), {status: 429, headers: {"retry-after": "0"}});
    return new Response(JSON.stringify({data: []}), {status: 200});
  };
  const credentials = {getAccessToken: async () => "abc"};
  const client = new MiroClient({apiBaseUrl: "https://api.miro.com", timeoutMs: 1000, maxRetries: 1}, credentials, fetchImpl);
  assert.deepEqual(await client.listBoards({}), {data: []});
  assert.equal(calls, 2);
});

test("writes are never blindly retried", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return new Response(JSON.stringify({message: "temporary"}), {status: 503});
  };
  const credentials = {getAccessToken: async () => "abc"};
  const client = new MiroClient({apiBaseUrl: "https://api.miro.com", timeoutMs: 1000, maxRetries: 3}, credentials, fetchImpl);
  await assert.rejects(client.createItem("text", {boardId: "b", data: {content: "x"}}), (e) => e instanceof MiroError && e.status === 503);
  assert.equal(calls, 1);
});

test("401 triggers one OAuth refresh in token-file mode", async () => {
  let calls = 0;
  const credentials = {
    getAccessToken: async () => calls === 0 ? "old" : "new",
    refresh: async () => ({access_token: "new"})
  };
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) return new Response(JSON.stringify({message: "expired"}), {status: 401});
    return new Response(JSON.stringify({id: "ok"}), {status: 200});
  };
  const client = new MiroClient({apiBaseUrl: "https://api.miro.com", timeoutMs: 1000, maxRetries: 0, tokenFile: "/tmp/token"}, credentials, fetchImpl);
  assert.deepEqual(await client.getBoard({boardId: "b"}), {id: "ok"});
  assert.equal(calls, 2);
});

test("credential provider rotates and persists refresh tokens atomically", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "miro-test-"));
  const tokenFile = path.join(dir, "token.json");
  await fs.writeFile(tokenFile, JSON.stringify({access_token: "old", refresh_token: "r1", expires_at: 1}), {mode: 0o600});

  const fetchImpl = async () => new Response(JSON.stringify({
    access_token: "new", refresh_token: "r2", expires_in: 3600, scope: "boards:read boards:write"
  }), {status: 200});
  const provider = new CredentialProvider({
    tokenFile, accessToken: "", apiBaseUrl: "https://api.miro.com", clientId: "id", clientSecret: "secret"
  }, fetchImpl);

  assert.equal(await provider.getAccessToken(), "new");
  const persisted = JSON.parse(await fs.readFile(tokenFile, "utf8"));
  assert.equal(persisted.refresh_token, "r2");
  await fs.rm(dir, {recursive: true, force: true});
});
