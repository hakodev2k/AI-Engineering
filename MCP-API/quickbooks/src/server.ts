import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { QuickBooksTokenProvider } from './auth.js';
import { QuickBooksClient } from './client.js';
import { loadConfig } from './config.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const tokens = new QuickBooksTokenProvider(config);
const client = new QuickBooksClient(config, tokens);
const server = new McpServer({ name: 'quickbooks-mcp-connector', version: '1.0.0' });
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const id = z.string().min(1).max(100).regex(/^\d+$/);
const approvalId = z.string().length(64).optional();
const pageSize = z.number().int().min(1).max(1000).optional();
const page = z.number().int().min(1).max(100000).optional();
const qboString = z.string().min(1).max(500);
const escapeQuery = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const paging = (entity: string, p = 1, size = 100) => `select * from ${entity} startposition ${(p - 1) * size + 1} maxresults ${size}`;

server.tool('quickbooks.company.get', 'Get QuickBooks Online company information. Permission: READ.', {}, async () =>
  out(await client.get(`/companyinfo/${config.realmId}`)));

server.tool('quickbooks.customer.search', 'Search customers by display name, or list customers. Permission: READ.', {
  name: z.string().min(1).max(200).optional(), page, pageSize
}, async a => {
  const size = a.pageSize ?? 100;
  const start = ((a.page ?? 1) - 1) * size + 1;
  const where = a.name ? ` where DisplayName like '%${escapeQuery(a.name)}%'` : '';
  return out(await client.query(`select * from Customer${where} startposition ${start} maxresults ${size}`));
});

server.tool('quickbooks.customer.get', 'Get one customer by QuickBooks ID. Permission: READ.', { id }, async a =>
  out(await client.get(`/customer/${a.id}`)));

server.tool('quickbooks.invoice.list', 'List invoices with bounded pagination. Permission: READ.', { page, pageSize }, async a =>
  out(await client.query(paging('Invoice', a.page, a.pageSize))));

server.tool('quickbooks.invoice.get', 'Get one invoice by QuickBooks ID. Permission: READ.', { id }, async a =>
  out(await client.get(`/invoice/${a.id}`)));

server.tool('quickbooks.payment.list', 'List received payments with bounded pagination. Permission: READ.', { page, pageSize }, async a =>
  out(await client.query(paging('Payment', a.page, a.pageSize))));

server.tool('quickbooks.payment.get', 'Get one received payment by QuickBooks ID. Permission: READ.', { id }, async a =>
  out(await client.get(`/payment/${a.id}`)));

server.tool('quickbooks.item.search', 'Search products/services by name, or list items. Permission: READ.', {
  name: z.string().min(1).max(200).optional(), page, pageSize
}, async a => {
  const size = a.pageSize ?? 100;
  const start = ((a.page ?? 1) - 1) * size + 1;
  const where = a.name ? ` where Name like '%${escapeQuery(a.name)}%'` : '';
  return out(await client.query(`select * from Item${where} startposition ${start} maxresults ${size}`));
});

server.tool('quickbooks.report.run', 'Run an allowlisted QuickBooks accounting report. Permission: READ.', {
  report: z.enum(['ProfitAndLoss', 'BalanceSheet', 'CashFlow', 'AgedReceivables', 'AgedPayables', 'GeneralLedger']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  accountingMethod: z.enum(['Cash', 'Accrual']).optional()
}, async a => out(await client.report(a.report, {
  start_date: a.startDate,
  end_date: a.endDate,
  accounting_method: a.accountingMethod
})));

server.tool('quickbooks.customer.create', 'Create a customer. Permission: WRITE. Requires explicit human approval.', {
  displayName: qboString,
  companyName: z.string().max(500).optional(),
  email: z.string().email().max(254).optional(),
  phone: z.string().max(50).optional(),
  billingAddress: z.object({
    line1: z.string().max(500).optional(), city: z.string().max(255).optional(),
    region: z.string().max(255).optional(), postalCode: z.string().max(30).optional(), country: z.string().max(255).optional()
  }).optional(),
  approvalId
}, async a => {
  assertApproval('quickbooks.customer.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/customer', {
    DisplayName: a.displayName,
    CompanyName: a.companyName,
    PrimaryEmailAddr: a.email ? { Address: a.email } : undefined,
    PrimaryPhone: a.phone ? { FreeFormNumber: a.phone } : undefined,
    BillAddr: a.billingAddress ? {
      Line1: a.billingAddress.line1, City: a.billingAddress.city,
      CountrySubDivisionCode: a.billingAddress.region, PostalCode: a.billingAddress.postalCode, Country: a.billingAddress.country
    } : undefined
  }));
});

server.tool('quickbooks.invoice.create', 'Create an invoice for an existing customer. Permission: WRITE. Requires explicit human approval.', {
  customerId: id,
  lines: z.array(z.object({
    description: z.string().max(4000).optional(),
    amount: z.number().positive().max(1000000000),
    itemId: id,
    quantity: z.number().positive().max(1000000).optional(),
    unitPrice: z.number().nonnegative().max(1000000000).optional()
  })).min(1).max(100),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  privateNote: z.string().max(4000).optional(),
  approvalId
}, async a => {
  assertApproval('quickbooks.invoice.create', a.approvalId, config.approvalSecret);
  return out(await client.post('/invoice', {
    CustomerRef: { value: a.customerId },
    DueDate: a.dueDate,
    PrivateNote: a.privateNote,
    Line: a.lines.map(line => ({
      DetailType: 'SalesItemLineDetail',
      Description: line.description,
      Amount: line.amount,
      SalesItemLineDetail: {
        ItemRef: { value: line.itemId },
        Qty: line.quantity,
        UnitPrice: line.unitPrice
      }
    }))
  }));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
