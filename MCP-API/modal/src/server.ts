import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig, type Config } from "./config.js";
import { ModalConnectorClient, type JsonValue } from "./client.js";
import { enforcePolicy, type Risk } from "./policy.js";

const JsonSchema: z.ZodType<JsonValue> = z.lazy(() => z.union([
  z.null(), z.boolean(), z.number(), z.string(),
  z.array(JsonSchema),
  z.record(JsonSchema)
]));

function ok(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

function fail(error: unknown) {
  const e = error instanceof Error ? error : new Error(String(error));
  return { isError: true, content: [{ type: "text" as const, text: JSON.stringify({ error: e.name, message: e.message }) }] };
}

export function createServer(config: Config, client = new ModalConnectorClient(config)) {
  const server = new McpServer({ name: "modal-connector", version: "1.0.0" });
  const register = <T extends z.ZodRawShape>(name: string, description: string, shape: T, risk: Risk, handler: (input: z.infer<z.ZodObject<T>>) => Promise<unknown>) => {
    server.tool(name, description, shape, async (input) => {
      try {
        const approved = Boolean((input as { approved?: boolean }).approved);
        enforcePolicy(config, risk, approved);
        return ok(await handler(input));
      } catch (e) { return fail(e); }
    });
  };

  register("modal.app.get", "Resolve a deployed Modal App by name. Risk: READ.", {
    name: z.string().min(1).max(128)
  }, "READ", ({ name }) => client.appGet(name));

  register("modal.function.invoke", "Synchronously invoke a deployed Modal Function. Arbitrary function code may have side effects; explicit approval required. Risk: HIGH_RISK.", {
    appName: z.string().min(1).max(128), functionName: z.string().min(1).max(256),
    args: z.array(JsonSchema).max(100).default([]), kwargs: z.record(JsonSchema).default({}), approved: z.boolean().default(false)
  }, "HIGH_RISK", ({ appName, functionName, args, kwargs }) => client.functionInvoke(appName, functionName, args, kwargs));

  register("modal.function.spawn", "Asynchronously invoke a deployed Modal Function and return its call id. Arbitrary function code may have side effects; explicit approval required. Risk: HIGH_RISK.", {
    appName: z.string().min(1).max(128), functionName: z.string().min(1).max(256),
    args: z.array(JsonSchema).max(100).default([]), kwargs: z.record(JsonSchema).default({}), approved: z.boolean().default(false)
  }, "HIGH_RISK", ({ appName, functionName, args, kwargs }) => client.functionSpawn(appName, functionName, args, kwargs));

  register("modal.sandbox.list", "List running Modal Sandboxes, optionally scoped to an App id. Risk: READ.", {
    appId: z.string().min(1).max(128).optional(), limit: z.number().int().min(1).max(200).default(50)
  }, "READ", ({ appId, limit }) => client.sandboxList(appId, limit));

  register("modal.sandbox.create", "Create a Modal Sandbox from a registry image with bounded resources and optional network restrictions. Creates billable compute; explicit approval required. Risk: HIGH_RISK.", {
    appName: z.string().min(1).max(128), image: z.string().min(1).max(512), command: z.array(z.string().max(2048)).min(1).max(64).optional(),
    cpu: z.number().positive().max(64).optional(), memoryMiB: z.number().int().min(128).max(524288).optional(), gpu: z.string().max(64).optional(),
    timeoutMs: z.number().int().min(1000).max(86400000).optional(), blockNetwork: z.boolean().optional(),
    outboundDomainAllowlist: z.array(z.string().min(1).max(253)).max(100).optional(), name: z.string().min(1).max(64).optional(), approved: z.boolean().default(false)
  }, "HIGH_RISK", (input) => client.sandboxCreate(input));

  register("modal.sandbox.exec", "Execute an argv-style command in an existing Sandbox. No shell string is accepted. Explicit approval required. Risk: HIGH_RISK.", {
    sandboxId: z.string().min(1).max(128), command: z.array(z.string().max(4096)).min(1).max(64),
    timeoutMs: z.number().int().min(1000).max(3600000).optional(), approved: z.boolean().default(false)
  }, "HIGH_RISK", ({ sandboxId, command, timeoutMs }) => client.sandboxExec(sandboxId, command, timeoutMs));

  register("modal.sandbox.terminate", "Terminate a running Modal Sandbox. Explicit approval required. Risk: HIGH_RISK.", {
    sandboxId: z.string().min(1).max(128), approved: z.boolean().default(false)
  }, "HIGH_RISK", ({ sandboxId }) => client.sandboxTerminate(sandboxId));

  register("modal.volume.get", "Resolve a named persistent Modal Volume without creating it. Risk: READ.", {
    name: z.string().min(1).max(128)
  }, "READ", ({ name }) => client.volumeGet(name));

  register("modal.volume.delete", "Irreversibly delete a named Modal Volume. Disabled by default and requires explicit approval. Risk: DESTRUCTIVE.", {
    name: z.string().min(1).max(128), approved: z.boolean().default(false)
  }, "DESTRUCTIVE", ({ name }) => client.volumeDelete(name));

  return server;
}

async function main() {
  const config = loadConfig();
  const server = createServer(config);
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
}
