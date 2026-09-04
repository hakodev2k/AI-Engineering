import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { PusherClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOL_BY_NAME, TOOLS } from "./tools.js";

export function buildServer(client = new PusherClient(loadConfig())) {
  const cfg = loadConfig();
  const server = new Server({ name: "pusher-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: `${t.purpose} Risk=${t.risk}.${t.risk === "READ" ? "" : " Explicit approval is required by connector policy."}`,
      inputSchema: t.inputSchema
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const spec = TOOL_BY_NAME.get(request.params.name);
    if (!spec) throw new Error("Unknown Pusher tool.");
    const args = { ...(request.params.arguments ?? {}) } as Record<string, any>;
    const approval = args.approval;
    delete args.approval;
    assertAllowed(spec.risk, approval, cfg);

    try {
      let result: unknown;
      switch (spec.name) {
        case "pusher.channel.list": result = await client.listChannels(args.filterByPrefix, args.info); break;
        case "pusher.channel.get": result = await client.getChannel(args.channel, args.info); break;
        case "pusher.presence.users.list": result = await client.listPresenceUsers(args.channel); break;
        case "pusher.event.publish": result = await client.publish(args.channels, args.event, args.data, args.socketId); break;
        case "pusher.event.publish_batch": result = await client.publishBatch(args.events); break;
        case "pusher.user.event.publish": result = await client.publishToUser(args.userId, args.event, args.data); break;
        case "pusher.user.connections.terminate": result = await client.terminateUserConnections(args.userId); break;
        case "pusher.webhook.verify": result = client.verifyWebhook({ "x-pusher-key": args.key, "x-pusher-signature": args.signature, "content-type": "application/json" }, args.rawBody); break;
        default: throw new Error("Unroutable Pusher tool.");
      }
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Pusher error";
      if (/401|auth|signature/i.test(message)) throw new Error("Pusher authentication/signature validation failed. Check app credentials or webhook signature.");
      if (/403|forbidden|permission/i.test(message)) throw new Error("Pusher denied this operation for the configured app credentials.");
      if (/429|rate.?limit|thrott/i.test(message)) throw new Error("Pusher rate or quota limit reached. Do not blindly retry write operations.");
      throw error;
    }
  });

  return server;
}

async function main() {
  const server = buildServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
