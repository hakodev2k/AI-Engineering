import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadConfig } from './config.js';
import { PlaidClient, PlaidError } from './client.js';
import { assertApproval, TOOL_POLICY } from './policy.js';

const cfg = loadConfig();
const client = new PlaidClient(cfg);
const server = new McpServer({ name: 'plaid-connector', version: '1.0.0' });

const accessToken = z.string().min(8).max(512).describe('Plaid access_token; handled inside the connector and never returned by tools');
const approvalId = z.string().min(32).max(256).optional().describe('Human approval HMAC for write/high-risk tools');
const count = z.number().int().min(1).max(500).optional();
const offset = z.number().int().min(0).max(100000).optional();

function result(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify({ untrusted_provider_data: true, data }) }] };
}

function errorResult(error: unknown) {
  if (error instanceof PlaidError) {
    return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'PLAID_ERROR', message: error.message, status: error.status, error_type: error.errorType, error_code: error.errorCode, request_id: error.requestId, retry_after_ms: error.retryAfterMs }) }] };
  }
  const message = error instanceof Error ? error.message : 'Unknown connector error';
  return { isError: true, content: [{ type: 'text' as const, text: JSON.stringify({ error: 'CONNECTOR_ERROR', message }) }] };
}

function register(name: string, description: string, schema: Record<string, z.ZodTypeAny>, handler: (args: any) => Promise<unknown>) {
  server.tool(name, `${description} Risk=${TOOL_POLICY[name]?.risk ?? 'UNKNOWN'}; approval=${TOOL_POLICY[name]?.approval ?? false}.`, schema, async (args) => {
    try { return result(await handler(args)); } catch (e) { return errorResult(e); }
  });
}

register('plaid.item.get', 'Get metadata/status for a linked Item.', { access_token: accessToken }, a => client.post('/item/get', { access_token: a.access_token }));
register('plaid.accounts.get', 'Get accounts and current balance data available for an Item.', { access_token: accessToken }, a => client.post('/accounts/get', { access_token: a.access_token }));
register('plaid.transactions.sync', 'Incrementally synchronize transaction changes using a cursor.', {
  access_token: accessToken,
  cursor: z.string().max(1024).optional(),
  count: z.number().int().min(1).max(500).optional(),
  options: z.object({ include_personal_finance_category: z.boolean().optional(), days_requested: z.number().int().min(1).max(730).optional() }).strict().optional()
}, a => client.post('/transactions/sync', { access_token: a.access_token, cursor: a.cursor, count: a.count, options: a.options }));
register('plaid.transactions.get', 'Fetch transactions for a bounded date range with pagination.', {
  access_token: accessToken,
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count,
  offset,
  account_ids: z.array(z.string().min(1).max(128)).max(100).optional()
}, a => client.post('/transactions/get', { access_token: a.access_token, start_date: a.start_date, end_date: a.end_date, options: { count: a.count, offset: a.offset, account_ids: a.account_ids } }));
register('plaid.transactions.recurring.get', 'Get recurring inflow and outflow streams.', {
  access_token: accessToken,
  account_ids: z.array(z.string().min(1).max(128)).max(100).optional()
}, a => client.post('/transactions/recurring/get', { access_token: a.access_token, account_ids: a.account_ids }));
register('plaid.transactions.refresh', 'Request an on-demand refresh of transaction data.', { access_token: accessToken, approval_id: approvalId }, async a => {
  assertApproval(cfg, 'plaid.transactions.refresh', { access_token: '[REDACTED]' }, a.approval_id);
  return client.post('/transactions/refresh', { access_token: a.access_token }, undefined, false);
});
register('plaid.identity.get', 'Get user-authorized identity information for accounts.', { access_token: accessToken }, a => client.post('/identity/get', { access_token: a.access_token }));
register('plaid.investments.holdings.get', 'Get user-authorized investment holdings.', { access_token: accessToken }, a => client.post('/investments/holdings/get', { access_token: a.access_token }));
register('plaid.investments.transactions.get', 'Get investment transactions with explicit pagination.', {
  access_token: accessToken,
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  count,
  offset,
  account_ids: z.array(z.string().min(1).max(128)).max(100).optional()
}, a => client.post('/investments/transactions/get', { access_token: a.access_token, start_date: a.start_date, end_date: a.end_date, options: { count: a.count, offset: a.offset, account_ids: a.account_ids } }));
register('plaid.investments.refresh', 'Request an on-demand investment-data refresh.', { access_token: accessToken, approval_id: approvalId }, async a => {
  assertApproval(cfg, 'plaid.investments.refresh', { access_token: '[REDACTED]' }, a.approval_id);
  return client.post('/investments/refresh', { access_token: a.access_token }, undefined, false);
});
register('plaid.liabilities.get', 'Get user-authorized liability data such as loans and credit accounts.', { access_token: accessToken }, a => client.post('/liabilities/get', { access_token: a.access_token }));
register('plaid.auth.get', 'Get account/routing information used for bank transfer setup; highly sensitive.', { access_token: accessToken, approval_id: approvalId }, async a => {
  assertApproval(cfg, 'plaid.auth.get', { access_token: '[REDACTED]' }, a.approval_id);
  return client.post('/auth/get', { access_token: a.access_token });
});

const transport = new StdioServerTransport();
await server.connect(transport);
