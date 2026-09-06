import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";

const read = { permission:"read", risk:"READ", approval:"none" } as const;
const write = { permission:"write", risk:"WRITE", approval:"configurable" } as const;
const send = { permission:"send", risk:"HIGH_RISK", approval:"explicit" } as const;

test("read executes without approval", () => assert.doesNotThrow(() => assertAllowed(read, {}, loadConfig({ FRONT_MCP_ACCESS_TOKEN:"x" }))));
test("write denied if scope not enabled", () => assert.throws(() => assertAllowed(write, {approved:true}, loadConfig({ FRONT_MCP_ACCESS_TOKEN:"x" }))));
test("write requires approval by default", () => assert.throws(() => assertAllowed(write, {}, loadConfig({ FRONT_MCP_ACCESS_TOKEN:"x", FRONT_PERMISSIONS:"read,write" }))));
test("send requires enable flag and explicit approval", () => {
  const c = loadConfig({ FRONT_MCP_ACCESS_TOKEN:"x", FRONT_PERMISSIONS:"read,send", FRONT_ENABLE_SEND:"true" });
  assert.throws(() => assertAllowed(send, {}, c));
  assert.doesNotThrow(() => assertAllowed(send, {approved:true}, c));
});
