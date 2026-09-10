import { z } from "zod";
import { AblyClient } from "./client.js";
import { requireApproval, validateChannel, type Risk } from "./policy.js";

const page = {
  start: z.number().int().nonnegative().optional(),
  end: z.number().int().nonnegative().optional(),
  direction: z.enum(["forwards", "backwards"]).optional(),
  limit: z.number().int().min(1).max(1000).optional()
};
const approval = { approved: z.boolean().optional() };
const message = z.object({
  name: z.string().min(1).max(256).optional(),
  data: z.unknown(),
  id: z.string().min(1).max(256).optional(),
  clientId: z.string().min(1).max(256).optional(),
  extras: z.record(z.unknown()).optional()
}).strict();

export type ToolSpec = {
  name: string;
  purpose: string;
  risk: Risk;
  requiredCapabilities: string[];
  schema: z.ZodTypeAny;
  execute: (input: any) => Promise<unknown>;
};

export function createTools(client: AblyClient): ToolSpec[] {
  return [
    {
      name: "ably.message.publish", purpose: "Publish one message to an Ably channel.", risk: "HIGH_RISK", requiredCapabilities: ["publish"],
      schema: z.object({ channel: z.string().min(1), message, ...approval }).strict(),
      execute: async input => { requireApproval("HIGH_RISK", input); const channel = validateChannel(input.channel); return (await client.request("POST", `/channels/${encodeURIComponent(channel)}/messages`, undefined, input.message)).data; }
    },
    {
      name: "ably.message.publish_batch", purpose: "Atomically publish multiple messages to one Ably channel.", risk: "HIGH_RISK", requiredCapabilities: ["publish"],
      schema: z.object({ channel: z.string().min(1), messages: z.array(message).min(1).max(100), ...approval }).strict(),
      execute: async input => { requireApproval("HIGH_RISK", input); const channel = validateChannel(input.channel); return (await client.request("POST", `/channels/${encodeURIComponent(channel)}/messages`, undefined, input.messages)).data; }
    },
    {
      name: "ably.message.history", purpose: "Read persisted message history for a channel.", risk: "READ", requiredCapabilities: ["history"],
      schema: z.object({ channel: z.string().min(1), ...page }).strict(),
      execute: async input => { const { channel, ...query } = input; return client.request("GET", `/channels/${encodeURIComponent(validateChannel(channel))}/messages`, query); }
    },
    {
      name: "ably.presence.get", purpose: "Read the current presence set for a channel.", risk: "READ", requiredCapabilities: ["subscribe"],
      schema: z.object({ channel: z.string().min(1), clientId: z.string().min(1).optional(), connectionId: z.string().min(1).optional(), limit: z.number().int().min(1).max(1000).optional() }).strict(),
      execute: async input => { const { channel, ...query } = input; return client.request("GET", `/channels/${encodeURIComponent(validateChannel(channel))}/presence`, query); }
    },
    {
      name: "ably.presence.history", purpose: "Read historical presence events for a channel.", risk: "READ", requiredCapabilities: ["history"],
      schema: z.object({ channel: z.string().min(1), ...page }).strict(),
      execute: async input => { const { channel, ...query } = input; return client.request("GET", `/channels/${encodeURIComponent(validateChannel(channel))}/presence/history`, query); }
    },
    {
      name: "ably.presence.batch_get", purpose: "Read current presence across multiple channels in one request.", risk: "READ", requiredCapabilities: ["subscribe"],
      schema: z.object({ channels: z.array(z.string().min(1)).min(1).max(100) }).strict(),
      execute: async input => client.request("GET", "/presence", { channels: input.channels.map(validateChannel).join(",") })
    },
    {
      name: "ably.channel.get", purpose: "Read channel metadata and occupancy; note that Ably documents that this request may activate the channel.", risk: "READ", requiredCapabilities: ["channel-metadata"],
      schema: z.object({ channel: z.string().min(1) }).strict(),
      execute: async input => (await client.request("GET", `/channels/${encodeURIComponent(validateChannel(input.channel))}`)).data
    },
    {
      name: "ably.channel.list", purpose: "Occasionally enumerate active channels; Ably heavily rate-limits this endpoint.", risk: "READ", requiredCapabilities: ["channel-metadata on *"],
      schema: z.object({ prefix: z.string().max(1024).optional(), by: z.enum(["id", "value"]).default("id"), limit: z.number().int().min(1).max(1000).optional() }).strict(),
      execute: async input => client.request("GET", "/channels", input)
    },
    {
      name: "ably.stats.get", purpose: "Read application usage statistics.", risk: "READ", requiredCapabilities: ["stats on *"],
      schema: z.object({ ...page, unit: z.enum(["minute", "hour", "day", "month"]).optional() }).strict(),
      execute: async input => client.request("GET", "/stats", input)
    },
    {
      name: "ably.service.time", purpose: "Read Ably service time for clock diagnostics.", risk: "READ", requiredCapabilities: [],
      schema: z.object({}).strict(),
      execute: async () => (await client.request<number[]>("GET", "/time")).data
    }
  ];
}
