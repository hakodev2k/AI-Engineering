import type { Risk } from "./policy.js";

export type ToolSpec = { name: string; purpose: string; risk: Risk; inputSchema: Record<string, unknown> };
const approval = {
  type: "object", additionalProperties: false,
  properties: { confirmed: { type: "boolean", const: true }, reason: { type: "string", minLength: 3, maxLength: 500 } },
  required: ["confirmed", "reason"]
};
const base = { type: "object", additionalProperties: false } as const;

export const TOOLS: readonly ToolSpec[] = [
  { name: "pusher.channel.list", purpose: "List active Channels application channels.", risk: "READ", inputSchema: { ...base, properties: { filterByPrefix: { type: "string", maxLength: 200 }, info: { type: "string", enum: ["user_count", "subscription_count"] } } } },
  { name: "pusher.channel.get", purpose: "Get state for one channel.", risk: "READ", inputSchema: { ...base, properties: { channel: { type: "string", minLength: 1, maxLength: 200 }, info: { type: "string", enum: ["user_count", "subscription_count"] } }, required: ["channel"] } },
  { name: "pusher.presence.users.list", purpose: "List users currently subscribed to a presence channel.", risk: "READ", inputSchema: { ...base, properties: { channel: { type: "string", pattern: "^presence-[A-Za-z0-9_\\-=@,.;]+$", maxLength: 200 } }, required: ["channel"] } },
  { name: "pusher.event.publish", purpose: "Publish an event to one or more channels.", risk: "WRITE", inputSchema: { ...base, properties: { channels: { type: "array", minItems: 1, maxItems: 100, items: { type: "string", minLength: 1, maxLength: 200 } }, event: { type: "string", minLength: 1, maxLength: 200 }, data: {}, socketId: { type: "string", pattern: "^[0-9]+\\.[0-9]+$" }, approval }, required: ["channels", "event", "data", "approval"] } },
  { name: "pusher.event.publish_batch", purpose: "Publish up to ten channel events in one request.", risk: "WRITE", inputSchema: { ...base, properties: { events: { type: "array", minItems: 1, maxItems: 10, items: { type: "object", additionalProperties: false, properties: { channel: { type: "string", minLength: 1, maxLength: 200 }, name: { type: "string", minLength: 1, maxLength: 200 }, data: {}, socket_id: { type: "string", pattern: "^[0-9]+\\.[0-9]+$" } }, required: ["channel", "name", "data"] } }, approval }, required: ["events", "approval"] } },
  { name: "pusher.user.event.publish", purpose: "Send an event to an authenticated Pusher user.", risk: "WRITE", inputSchema: { ...base, properties: { userId: { type: "string", minLength: 1, maxLength: 200 }, event: { type: "string", minLength: 1, maxLength: 200 }, data: {}, approval }, required: ["userId", "event", "data", "approval"] } },
  { name: "pusher.user.connections.terminate", purpose: "Terminate all active connections for an authenticated user.", risk: "HIGH_RISK", inputSchema: { ...base, properties: { userId: { type: "string", minLength: 1, maxLength: 200 }, approval }, required: ["userId", "approval"] } },
  { name: "pusher.webhook.verify", purpose: "Verify a Pusher Channels webhook signature and parse its events.", risk: "READ", inputSchema: { ...base, properties: { key: { type: "string", minLength: 1 }, signature: { type: "string", pattern: "^[0-9a-fA-F]{64}$" }, rawBody: { type: "string", minLength: 2, maxLength: 1048576 } }, required: ["key", "signature", "rawBody"] } }
] as const;

export const TOOL_BY_NAME = new Map(TOOLS.map((x) => [x.name, x]));
