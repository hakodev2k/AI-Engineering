import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { TwilioConnectorClient } from './client.js';
import { assertApproval, assertFromAllowed } from './policy.js';

const config = loadConfig();
const client = new TwilioConnectorClient(config);
const server = new McpServer({ name: 'twilio-mcp-api', version: '1.0.0' });
const phone = z.string().regex(/^\+[1-9]\d{6,14}$/, 'Use E.164 format');
const messageSid = z.string().regex(/^SM[0-9a-fA-F]{32}$/);
const callSid = z.string().regex(/^CA[0-9a-fA-F]{32}$/);
const numberSid = z.string().regex(/^PN[0-9a-fA-F]{32}$/);
const output = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const safe = (fn: () => Promise<unknown>) => fn().then(output).catch((error: unknown) => ({ isError: true, content: [{ type: 'text' as const, text: error instanceof Error ? error.message : 'Twilio operation failed' }] }));

server.tool('twilio.api.search', 'READ: search Twilio official API specs/docs through Twilio MCP.', {
  query: z.string().min(2).max(500),
  version: z.string().regex(/^[A-Za-z0-9._-]{1,40}$/).optional()
}, ({ query, version }) => safe(() => client.apiSearch(query, version)));

server.tool('twilio.api.retrieve', 'READ: retrieve schemas for Twilio API IDs returned by twilio.api.search.', {
  ids: z.array(z.string().min(1).max(300)).min(1).max(10)
}, ({ ids }) => safe(() => client.apiRetrieve(ids)));

server.tool('twilio.account.get', 'READ: get metadata for the configured Twilio account.', {}, () => safe(() => client.accountGet()));

server.tool('twilio.message.list', 'READ: list recent messages with optional E.164 filters.', {
  limit: z.number().int().min(1).max(100).default(20), to: phone.optional(), from: phone.optional()
}, ({ limit, to, from }) => safe(() => client.messageList(limit, to, from)));

server.tool('twilio.message.get', 'READ: fetch one message by SM SID.', { messageSid }, ({ messageSid }) => safe(() => client.messageGet(messageSid)));

server.tool('twilio.message.send', 'HIGH_RISK: send an external SMS/MMS-style message. Requires allowed From and HMAC approval.', {
  to: phone, from: phone, body: z.string().min(1).max(1600), approvalId: z.string().min(1)
}, ({ to, from, body, approvalId }) => safe(async () => {
  assertFromAllowed(from, config.allowedFromNumbers);
  assertApproval('twilio.message.send', `${from}->${to}`, approvalId, config.approvalSecret);
  return client.messageSend({ to, from, body });
}));

server.tool('twilio.call.list', 'READ: list recent calls with optional E.164 filters.', {
  limit: z.number().int().min(1).max(100).default(20), to: phone.optional(), from: phone.optional()
}, ({ limit, to, from }) => safe(() => client.callList(limit, to, from)));

server.tool('twilio.call.get', 'READ: fetch one call by CA SID.', { callSid }, ({ callSid }) => safe(() => client.callGet(callSid)));

server.tool('twilio.call.create', 'HIGH_RISK: initiate an outbound call using inline TwiML. Requires allowed From and HMAC approval.', {
  to: phone, from: phone, twiml: z.string().min(1).max(64000), approvalId: z.string().min(1)
}, ({ to, from, twiml, approvalId }) => safe(async () => {
  assertFromAllowed(from, config.allowedFromNumbers);
  assertApproval('twilio.call.create', `${from}->${to}`, approvalId, config.approvalSecret);
  return client.callCreate({ to, from, twiml });
}));

server.tool('twilio.phone_number.list', 'READ: list incoming phone numbers owned by the account.', {
  limit: z.number().int().min(1).max(100).default(20)
}, ({ limit }) => safe(() => client.phoneNumberList(limit)));

server.tool('twilio.phone_number.get', 'READ: fetch one incoming phone number by PN SID.', { phoneNumberSid: numberSid }, ({ phoneNumberSid }) => safe(() => client.phoneNumberGet(phoneNumberSid)));

await server.connect(new StdioServerTransport());
