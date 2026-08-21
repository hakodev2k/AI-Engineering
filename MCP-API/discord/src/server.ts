import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { DiscordClient } from "./discord-client.js";
import { Policy, TOOL_RISK } from "./policy.js";

const id = z.string().regex(/^\d{5,25}$/, "Discord snowflake must contain only digits");
const approval = z.string().min(8).max(200).optional();
const content = z.string().min(1).max(2000);
const threadName = z.string().min(1).max(100);
const archiveDuration = z.union([z.literal(60), z.literal(1440), z.literal(4320), z.literal(10080)]).default(1440);

const schemas = {
  "discord.guild.get": z.object({ guild_id: id }),
  "discord.guild.channels.list": z.object({ guild_id: id }),
  "discord.channel.get": z.object({ channel_id: id }),
  "discord.messages.list": z.object({ channel_id: id, limit: z.number().int().min(1).max(100).default(50), before: id.optional() }),
  "discord.message.get": z.object({ channel_id: id, message_id: id }),
  "discord.message.send": z.object({ channel_id: id, content, approval_id: approval }),
  "discord.message.edit": z.object({ channel_id: id, message_id: id, content, approval_id: approval }),
  "discord.message.delete": z.object({ channel_id: id, message_id: id, approval_id: approval }),
  "discord.reaction.add": z.object({ channel_id: id, message_id: id, emoji: z.string().min(1).max(100), approval_id: approval }),
  "discord.thread.start_from_message": z.object({ channel_id: id, message_id: id, name: threadName, auto_archive_duration: archiveDuration, approval_id: approval }),
  "discord.thread.start": z.object({ channel_id: id, name: threadName, auto_archive_duration: archiveDuration, type: z.union([z.literal(11), z.literal(12)]).default(11), approval_id: approval })
} as const;

type ToolName = keyof typeof schemas;

const descriptions: Record<ToolName, string> = {
  "discord.guild.get": "Read metadata for one Discord guild the bot can access.",
  "discord.guild.channels.list": "List channels in a Discord guild.",
  "discord.channel.get": "Read metadata for one Discord channel.",
  "discord.messages.list": "List recent messages from a channel with bounded pagination.",
  "discord.message.get": "Read one message by channel and message id.",
  "discord.message.send": "Send an external Discord message; explicit approval is required.",
  "discord.message.edit": "Edit a message owned by the application; explicit approval is required.",
  "discord.message.delete": "Delete a message; destructive and explicit approval is required.",
  "discord.reaction.add": "Add the bot's reaction to a message; explicit approval is required.",
  "discord.thread.start_from_message": "Create a thread from an existing message; explicit approval is required.",
  "discord.thread.start": "Create a public or private thread where Discord permissions permit; explicit approval is required."
};

function jsonSchema(name: ToolName) {
  const commonId = { type: "string", pattern: "^\\d{5,25}$" };
  const approvalId = { type: "string", minLength: 8, maxLength: 200 };
  const props: Record<string, unknown> = {};
  const required: string[] = [];
  if (name.includes("guild")) { props.guild_id = commonId; required.push("guild_id"); }
  if (name.includes("channel") || name.includes("message") || name.includes("reaction") || name.includes("thread")) { props.channel_id = commonId; required.push("channel_id"); }
  if (name === "discord.messages.list") { props.limit = { type: "integer", minimum: 1, maximum: 100, default: 50 }; props.before = commonId; }
  if (["discord.message.get","discord.message.edit","discord.message.delete","discord.reaction.add","discord.thread.start_from_message"].includes(name)) { props.message_id = commonId; required.push("message_id"); }
  if (["discord.message.send","discord.message.edit"].includes(name)) { props.content = { type: "string", minLength: 1, maxLength: 2000 }; required.push("content"); }
  if (name === "discord.reaction.add") { props.emoji = { type: "string", minLength: 1, maxLength: 100 }; required.push("emoji"); }
  if (["discord.thread.start_from_message","discord.thread.start"].includes(name)) { props.name = { type: "string", minLength: 1, maxLength: 100 }; props.auto_archive_duration = { type: "integer", enum: [60,1440,4320,10080], default: 1440 }; required.push("name"); }
  if (name === "discord.thread.start") props.type = { type: "integer", enum: [11,12], default: 11 };
  if (TOOL_RISK[name] !== "READ") { props.approval_id = approvalId; required.push("approval_id"); }
  return { type: "object", properties: props, required, additionalProperties: false };
}

export function buildServer(client: DiscordClient, policy = new Policy()) {
  const server = new Server({ name: "discord-mcp-api-connector", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: (Object.keys(schemas) as ToolName[]).map(name => ({
      name,
      description: `${descriptions[name]} Risk: ${TOOL_RISK[name]}.`,
      inputSchema: jsonSchema(name)
    }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async request => {
    const name = request.params.name as ToolName;
    if (!(name in schemas)) return toolError(`Unknown tool: ${name}`);
    try {
      const args = schemas[name].parse(request.params.arguments ?? {}) as Record<string, any>;
      policy.requireApproval(TOOL_RISK[name], args.approval_id);
      if (args.guild_id) policy.assertGuild(args.guild_id);
      if (args.channel_id) policy.assertChannel(args.channel_id);

      let result: unknown;
      switch (name) {
        case "discord.guild.get": result = await client.getGuild(args.guild_id); break;
        case "discord.guild.channels.list": result = await client.listGuildChannels(args.guild_id); break;
        case "discord.channel.get": result = await client.getChannel(args.channel_id); break;
        case "discord.messages.list": result = await client.listMessages(args.channel_id, args.limit, args.before); break;
        case "discord.message.get": result = await client.getMessage(args.channel_id, args.message_id); break;
        case "discord.message.send": result = await client.sendMessage(args.channel_id, args.content); break;
        case "discord.message.edit": result = await client.editMessage(args.channel_id, args.message_id, args.content); break;
        case "discord.message.delete": result = await client.deleteMessage(args.channel_id, args.message_id); break;
        case "discord.reaction.add": result = await client.addReaction(args.channel_id, args.message_id, args.emoji); break;
        case "discord.thread.start_from_message": result = await client.startThreadFromMessage(args.channel_id, args.message_id, args.name, args.auto_archive_duration); break;
        case "discord.thread.start": result = await client.startThread(args.channel_id, args.name, args.auto_archive_duration, args.type); break;
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(result) }] };
    } catch (error) {
      return toolError(error instanceof Error ? error.message : "Unknown Discord connector error");
    }
  });

  return server;
}

function toolError(message: string) {
  return { isError: true, content: [{ type: "text" as const, text: message }] };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const client = new DiscordClient({
    token: process.env.DISCORD_BOT_TOKEN ?? "",
    baseUrl: process.env.DISCORD_API_BASE_URL,
    timeoutMs: Number(process.env.DISCORD_REQUEST_TIMEOUT_MS ?? 10000),
    maxRetries: Number(process.env.DISCORD_MAX_RETRIES ?? 2)
  });
  const server = buildServer(client);
  await server.connect(new StdioServerTransport());
}
