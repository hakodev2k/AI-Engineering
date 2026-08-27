import test from "node:test";
import assert from "node:assert/strict";
import { RailwayUpstream } from "../src/upstream.js";

test("upstream caches official tool discovery", async () => {
  let lists = 0;
  const fakeClient = {
    connect: async () => {},
    listTools: async () => {
      lists++;
      return { tools: [{ name: "list_projects", inputSchema: { type: "object", properties: {} } }] };
    },
    callTool: async ({ name }) => ({ content: [{ type: "text", text: name }] }),
    close: async () => {}
  };
  const upstream = new RailwayUpstream(
    { cliPath: "railway", timeoutMs: 1000 },
    { client: fakeClient, transport: {} }
  );

  assert.equal((await upstream.getTool("list_projects")).name, "list_projects");
  assert.equal((await upstream.getTool("list_projects")).name, "list_projects");
  assert.equal(lists, 1);
});

test("upstream refuses calls to tools absent from official discovery", async () => {
  const fakeClient = {
    connect: async () => {},
    listTools: async () => ({ tools: [] }),
    callTool: async () => { throw new Error("should not be called"); },
    close: async () => {}
  };
  const upstream = new RailwayUpstream(
    { cliPath: "railway", timeoutMs: 1000 },
    { client: fakeClient, transport: {} }
  );
  await assert.rejects(() => upstream.callTool("deploy", {}), /does not expose required tool/);
});
