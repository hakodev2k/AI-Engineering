import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ShopifyClient, assertNoUserErrors } from './client.js';
import { assertWriteAllowed, loadConfig } from './config.js';

const config = loadConfig();
const client = new ShopifyClient(config);
const server = new McpServer({ name: 'shopify-connector', version: '1.0.0' });
const json = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
const Gid = z.string().regex(/^gid:\/\/shopify\/[A-Za-z]+\/\d+$/);
const Cursor = z.string().max(1000).optional();
const PageSize = z.number().int().min(1).max(100).default(25);

server.tool('shopify.access_scope.list', 'List scopes granted to the current app installation. READ.', {}, async () =>
  json(await client.graphql(`query { currentAppInstallation { accessScopes { handle description } } }`)));

server.tool('shopify.shop.get', 'Get basic shop metadata. READ.', {}, async () =>
  json(await client.graphql(`query { shop { id name myshopifyDomain email currencyCode timezoneAbbreviation } }`)));

server.tool('shopify.product.list', 'List/search products with cursor pagination. READ; requires read_products.', {
  first: PageSize, after: Cursor, query: z.string().max(1000).optional()
}, async (v) => json(await client.graphql(`query($first:Int!,$after:String,$query:String){ products(first:$first,after:$after,query:$query){ nodes { id title handle status vendor productType updatedAt } pageInfo { hasNextPage endCursor } } }`, v)));

server.tool('shopify.product.get', 'Get one product. READ; requires read_products.', { id: Gid }, async ({ id }) =>
  json(await client.graphql(`query($id:ID!){ product(id:$id){ id title descriptionHtml handle status vendor productType tags updatedAt variants(first:50){ nodes { id title sku barcode price inventoryQuantity } } } }`, { id })));

const ProductInput = {
  title: z.string().min(1).max(255),
  descriptionHtml: z.string().max(100000).optional(),
  vendor: z.string().max(255).optional(),
  productType: z.string().max(255).optional(),
  tags: z.array(z.string().min(1).max(255)).max(250).optional(),
  status: z.enum(['ACTIVE','ARCHIVED','DRAFT']).optional()
};

server.tool('shopify.product.create', 'Create a product. WRITE; requires write_products and operator approval by default.', ProductInput, async (product) => {
  assertWriteAllowed(config, 'shopify.product.create');
  const data = await client.graphql<any>(`mutation($product:ProductCreateInput!){ productCreate(product:$product){ product { id title handle status } userErrors { field message } } }`, { product }, true);
  return json(assertNoUserErrors(data, 'productCreate'));
});

server.tool('shopify.product.update', 'Update supported product fields. WRITE; requires write_products and operator approval by default.', { id: Gid, ...ProductInput }, async ({ id, ...rest }) => {
  assertWriteAllowed(config, 'shopify.product.update');
  const data = await client.graphql<any>(`mutation($product:ProductUpdateInput!){ productUpdate(product:$product){ product { id title handle status updatedAt } userErrors { field message } } }`, { product: { id, ...rest } }, true);
  return json(assertNoUserErrors(data, 'productUpdate'));
});

server.tool('shopify.product.delete', 'Delete a product permanently. DESTRUCTIVE; requires write_products, explicit approval, and destructive enablement.', { id: Gid }, async ({ id }) => {
  assertWriteAllowed(config, 'shopify.product.delete', true);
  const data = await client.graphql<any>(`mutation($input:ProductDeleteInput!){ productDelete(input:$input){ deletedProductId userErrors { field message } } }`, { input: { id } }, true);
  return json(assertNoUserErrors(data, 'productDelete'));
});

server.tool('shopify.order.list', 'List/search orders. READ; requires read_orders (older orders may require read_all_orders approval).', {
  first: PageSize, after: Cursor, query: z.string().max(1000).optional()
}, async (v) => json(await client.graphql(`query($first:Int!,$after:String,$query:String){ orders(first:$first,after:$after,query:$query,sortKey:CREATED_AT,reverse:true){ nodes { id name createdAt displayFinancialStatus displayFulfillmentStatus totalPriceSet { shopMoney { amount currencyCode } } } pageInfo { hasNextPage endCursor } } }`, v)));

server.tool('shopify.order.get', 'Get one order and line-item summary. READ; requires read_orders.', { id: Gid }, async ({ id }) =>
  json(await client.graphql(`query($id:ID!){ order(id:$id){ id name createdAt cancelledAt displayFinancialStatus displayFulfillmentStatus email note tags totalPriceSet { shopMoney { amount currencyCode } } lineItems(first:100){ nodes { id name quantity sku originalUnitPriceSet { shopMoney { amount currencyCode } } } } } }`, { id })));

server.tool('shopify.location.list', 'List active locations. READ; requires read_locations.', { first: PageSize, after: Cursor }, async (v) =>
  json(await client.graphql(`query($first:Int!,$after:String){ locations(first:$first,after:$after,includeInactive:false){ nodes { id name isActive address { address1 city provinceCode countryCodeV2 zip } } pageInfo { hasNextPage endCursor } } }`, v)));

server.tool('shopify.inventory_level.list', 'List inventory levels for an inventory item. READ; requires read_inventory and read_locations.', { inventory_item_id: Gid, first: PageSize, after: Cursor }, async ({ inventory_item_id, first, after }) =>
  json(await client.graphql(`query($id:ID!,$first:Int!,$after:String){ inventoryItem(id:$id){ id sku tracked inventoryLevels(first:$first,after:$after){ nodes { id location { id name } quantities(names:["available","on_hand"]){ name quantity } } pageInfo { hasNextPage endCursor } } } }`, { id: inventory_item_id, first, after })));

server.tool('shopify.webhook.list', 'List webhook subscriptions. READ; requires appropriate app access.', { first: PageSize, after: Cursor }, async (v) =>
  json(await client.graphql(`query($first:Int!,$after:String){ webhookSubscriptions(first:$first,after:$after){ nodes { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } createdAt updatedAt } pageInfo { hasNextPage endCursor } } }`, v)));

server.tool('shopify.webhook.create', 'Create an HTTPS webhook subscription. WRITE; explicit approval required by default.', {
  topic: z.string().regex(/^[A-Z0-9_]+$/).max(120),
  callback_url: z.string().url().startsWith('https://').max(2048)
}, async ({ topic, callback_url }) => {
  assertWriteAllowed(config, 'shopify.webhook.create');
  const data = await client.graphql<any>(`mutation($topic:WebhookSubscriptionTopic!,$webhookSubscription:WebhookSubscriptionInput!){ webhookSubscriptionCreate(topic:$topic,webhookSubscription:$webhookSubscription){ webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } } userErrors { field message } } }`, { topic, webhookSubscription: { callbackUrl: callback_url, format: 'JSON' } }, true);
  return json(assertNoUserErrors(data, 'webhookSubscriptionCreate'));
});

server.tool('shopify.webhook.delete', 'Delete a webhook subscription. DESTRUCTIVE; explicit approval and destructive enablement required.', { id: Gid }, async ({ id }) => {
  assertWriteAllowed(config, 'shopify.webhook.delete', true);
  const data = await client.graphql<any>(`mutation($id:ID!){ webhookSubscriptionDelete(id:$id){ deletedWebhookSubscriptionId userErrors { field message } } }`, { id }, true);
  return json(assertNoUserErrors(data, 'webhookSubscriptionDelete'));
});

await server.connect(new StdioServerTransport());
