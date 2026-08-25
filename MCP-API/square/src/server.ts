import crypto from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { EnvironmentCredentialProvider } from './auth.js';
import { SquareClient } from './client.js';
import { enforcePolicy } from './policy.js';

const config = loadConfig();
const client = new SquareClient(config, new EnvironmentCredentialProvider(config));
const server = new McpServer({ name: 'square-mcp-connector', version: '1.0.0' });
const id = z.string().min(1).max(255).regex(/^[A-Za-z0-9_-]+$/);
const cursor = z.string().max(2000).optional();
const approvalId = z.string().length(64).optional();
const object = z.record(z.string(), z.unknown());
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const enc = encodeURIComponent;
const approved = (tool: string, args: Record<string, unknown>) => {
  const { approvalId: token, ...payload } = args;
  enforcePolicy(config, tool, payload, token as string | undefined);
  return payload;
};

server.tool('square.location.list', 'List seller locations. READ; scope MERCHANT_PROFILE_READ.', {}, async () =>
  out(await client.request('GET', '/locations'))
);

server.tool('square.location.get', 'Retrieve one seller location. READ; scope MERCHANT_PROFILE_READ.', { locationId: id }, async a =>
  out(await client.request('GET', `/locations/${enc(a.locationId)}`))
);

server.tool('square.catalog.list', 'List catalog objects by explicit types. READ; scope ITEMS_READ.', {
  types: z.array(z.enum(['ITEM','ITEM_VARIATION','CATEGORY','MODIFIER','MODIFIER_LIST','TAX','DISCOUNT','IMAGE'])).min(1).max(8), cursor
}, async a => out(await client.request('GET', '/catalog/list', { query: { types: a.types.join(','), cursor: a.cursor } })));

server.tool('square.catalog.search', 'Search catalog objects using Square search filters. READ; scope ITEMS_READ.', {
  objectTypes: z.array(z.string().min(1).max(80)).min(1).max(20).optional(),
  query: object.optional(),
  cursor,
  limit: z.number().int().min(1).max(1000).optional(),
  includeDeletedObjects: z.boolean().optional()
}, async a => out(await client.request('POST', '/catalog/search', { body: {
  object_types: a.objectTypes, query: a.query, cursor: a.cursor, limit: a.limit, include_deleted_objects: a.includeDeletedObjects
}, retrySafe: true })));

server.tool('square.customer.search', 'Search customers. READ; scope CUSTOMERS_READ.', {
  query: object.optional(), cursor, limit: z.number().int().min(1).max(100).optional()
}, async a => out(await client.request('POST', '/customers/search', { body: { query: a.query, cursor: a.cursor, limit: a.limit }, retrySafe: true })));

server.tool('square.customer.get', 'Retrieve one customer. READ; scope CUSTOMERS_READ.', { customerId: id }, async a =>
  out(await client.request('GET', `/customers/${enc(a.customerId)}`))
);

server.tool('square.customer.create', 'Create a customer. WRITE; configurable explicit approval; scope CUSTOMERS_WRITE.', {
  givenName: z.string().max(300).optional(), familyName: z.string().max(300).optional(),
  companyName: z.string().max(500).optional(), emailAddress: z.string().email().max(254).optional(),
  phoneNumber: z.string().max(50).optional(), note: z.string().max(10000).optional(),
  idempotencyKey: z.string().min(1).max(45).optional(), approvalId
}, async a => {
  const payload = approved('square.customer.create', a as unknown as Record<string, unknown>);
  const body: Record<string, unknown> = {
    given_name: payload.givenName, family_name: payload.familyName, company_name: payload.companyName,
    email_address: payload.emailAddress, phone_number: payload.phoneNumber, note: payload.note
  };
  if (payload.idempotencyKey) body.idempotency_key = payload.idempotencyKey;
  return out(await client.request('POST', '/customers', { body, idempotencyKey: payload.idempotencyKey as string | undefined, retrySafe: Boolean(payload.idempotencyKey) }));
});

server.tool('square.customer.update', 'Update selected fields on a customer. WRITE; configurable explicit approval; scope CUSTOMERS_WRITE.', {
  customerId: id, version: z.number().int().nonnegative().optional(), givenName: z.string().max(300).optional(),
  familyName: z.string().max(300).optional(), companyName: z.string().max(500).optional(),
  emailAddress: z.string().email().max(254).optional(), phoneNumber: z.string().max(50).optional(),
  note: z.string().max(10000).optional(), approvalId
}, async a => {
  const payload = approved('square.customer.update', a as unknown as Record<string, unknown>);
  return out(await client.request('PUT', `/customers/${enc(a.customerId)}`, { body: {
    version: payload.version, given_name: payload.givenName, family_name: payload.familyName,
    company_name: payload.companyName, email_address: payload.emailAddress, phone_number: payload.phoneNumber, note: payload.note
  } }));
});

server.tool('square.order.search', 'Search orders for one or more locations. READ; scope ORDERS_READ.', {
  locationIds: z.array(id).min(1).max(10), query: object.optional(), cursor,
  limit: z.number().int().min(1).max(1000).optional(), returnEntries: z.boolean().optional()
}, async a => out(await client.request('POST', '/orders/search', { body: {
  location_ids: a.locationIds, query: a.query, cursor: a.cursor, limit: a.limit, return_entries: a.returnEntries
}, retrySafe: true })));

server.tool('square.order.get', 'Retrieve an order by ID. READ; scope ORDERS_READ.', { orderId: id }, async a =>
  out(await client.request('GET', `/orders/${enc(a.orderId)}`))
);

server.tool('square.order.create', 'Create a Square order. WRITE; configurable explicit approval; scope ORDERS_WRITE.', {
  order: object, idempotencyKey: z.string().min(1).max(45).default(() => crypto.randomUUID()), approvalId
}, async a => {
  const payload = approved('square.order.create', a as unknown as Record<string, unknown>);
  return out(await client.request('POST', '/orders', { body: { order: payload.order, idempotency_key: payload.idempotencyKey }, idempotencyKey: payload.idempotencyKey as string, retrySafe: true }));
});

server.tool('square.payment.list', 'List payments with bounded pagination controls. READ; scope PAYMENTS_READ.', {
  beginTime: z.string().datetime().optional(), endTime: z.string().datetime().optional(),
  sortOrder: z.enum(['ASC','DESC']).optional(), cursor, locationId: id.optional(),
  total: z.number().int().nonnegative().optional(), limit: z.number().int().min(1).max(100).optional()
}, async a => out(await client.request('GET', '/payments', { query: {
  begin_time: a.beginTime, end_time: a.endTime, sort_order: a.sortOrder, cursor: a.cursor,
  location_id: a.locationId, total: a.total, limit: a.limit
} })));

server.tool('square.payment.get', 'Retrieve one payment. READ; scope PAYMENTS_READ.', { paymentId: id }, async a =>
  out(await client.request('GET', `/payments/${enc(a.paymentId)}`))
);

server.tool('square.refund.create', 'Refund a completed payment. HIGH_RISK financial action; explicit approval always required; scope PAYMENTS_WRITE.', {
  paymentId: id,
  amount: z.number().int().positive(),
  currency: z.string().length(3).regex(/^[A-Z]{3}$/),
  reason: z.string().max(192).optional(),
  idempotencyKey: z.string().min(1).max(45).default(() => crypto.randomUUID()),
  approvalId
}, async a => {
  const payload = approved('square.refund.create', a as unknown as Record<string, unknown>);
  return out(await client.request('POST', '/refunds', { body: {
    idempotency_key: payload.idempotencyKey,
    payment_id: payload.paymentId,
    amount_money: { amount: payload.amount, currency: payload.currency },
    reason: payload.reason
  }, idempotencyKey: payload.idempotencyKey as string, retrySafe: true }));
});

const transport = new StdioServerTransport();
await server.connect(transport);
