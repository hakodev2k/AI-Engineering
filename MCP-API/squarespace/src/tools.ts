import { z } from 'zod';
import type { SquarespaceClient } from './client.js';
import type { SquarespaceConfig } from './config.js';
import { enforcePolicy, TOOL_RISK } from './policy.js';

const id = z.string().trim().min(1).max(200).regex(/^[A-Za-z0-9._:-]+$/);
const cursor = z.string().trim().min(1).max(4096).optional();
const iso = z.string().datetime({ offset: true });
const approvalToken = z.string().regex(/^[0-9a-f]{64}$/).optional();
const moneyStatus = z.enum(['NOT_CHARGED','AUTHORIZED','PAID','REFUNDED','PENDING','FAILED','REFUND_PENDING','REFUND_FAILED','PARTIALLY_PAID']);

const schemas = {
  orderList: z.object({
    cursor,
    customerId: id.optional(),
    modifiedAfter: iso.optional(),
    modifiedBefore: iso.optional(),
    fulfillmentStatus: z.enum(['PENDING','FULFILLED','CANCELED']).optional(),
    paymentStates: z.array(moneyStatus).min(1).max(9).optional()
  }).strict().superRefine((v, ctx) => {
    if (!!v.modifiedAfter !== !!v.modifiedBefore) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'modifiedAfter and modifiedBefore must be supplied together' });
    if (v.cursor && (v.customerId || v.modifiedAfter || v.modifiedBefore || v.fulfillmentStatus || v.paymentStates)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'cursor cannot be combined with other order filters' });
  }),
  orderGet: z.object({ id }).strict(),
  orderFulfill: z.object({
    id,
    shipments: z.array(z.object({
      carrierName: z.string().trim().min(1).max(100),
      service: z.string().trim().min(1).max(100).optional(),
      shipDate: iso.optional(),
      trackingNumber: z.string().trim().min(1).max(200).optional(),
      trackingUrl: z.string().url().max(2048).optional()
    }).strict()).max(20).default([]),
    shouldSendNotification: z.boolean().default(false),
    approvalToken
  }).strict(),
  txList: z.object({ cursor, modifiedAfter: iso.optional(), modifiedBefore: iso.optional(), orderId: id.optional() }).strict().superRefine((v, ctx) => {
    if (!!v.modifiedAfter !== !!v.modifiedBefore) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'modifiedAfter and modifiedBefore must be supplied together' });
  }),
  txGet: z.object({ documentIds: z.array(id).min(1).max(50) }).strict(),
  inventoryList: z.object({ cursor }).strict(),
  inventoryAdjust: z.object({
    idempotencyKey: z.string().min(1).max(64).regex(/^[A-Za-z0-9_-]+$/),
    incrementOperations: z.array(z.object({ variantId: id, quantity: z.number().int().min(1).max(1000000) }).strict()).max(100).optional(),
    decrementOperations: z.array(z.object({ variantId: id, quantity: z.number().int().min(1).max(1000000) }).strict()).max(100).optional(),
    setFiniteOperations: z.array(z.object({ variantId: id, quantity: z.number().int().min(0).max(1000000) }).strict()).max(100).optional(),
    setUnlimitedOperations: z.array(id).max(100).optional(),
    approvalToken
  }).strict().superRefine((v, ctx) => {
    const count = (v.incrementOperations?.length ?? 0) + (v.decrementOperations?.length ?? 0) + (v.setFiniteOperations?.length ?? 0) + (v.setUnlimitedOperations?.length ?? 0);
    if (count === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'At least one inventory adjustment is required' });
  }),
  productList: z.object({ cursor, modifiedAfter: iso.optional(), modifiedBefore: iso.optional(), query: z.string().trim().min(1).max(200).optional(), type: z.array(z.enum(['PHYSICAL','SERVICE','GIFT_CARD','DOWNLOAD'])).min(1).max(4).optional() }).strict(),
  productGet: z.object({ productIds: z.array(id).min(1).max(50) }).strict(),
  productUpdate: z.object({
    productId: id,
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(20000).optional(),
    isVisible: z.boolean().optional(),
    approvalToken
  }).strict().superRefine((v, ctx) => {
    if (v.name === undefined && v.description === undefined && v.isVisible === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'At least one update field is required' });
  }),
  contactList: z.object({ cursor, pageSize: z.number().int().min(1).max(100).default(50) }).strict(),
  contactGet: z.object({ contactId: id }).strict(),
  contactQuery: z.object({ searchString: z.string().trim().min(1).max(200), cursor, pageSize: z.number().int().min(1).max(100).default(50), sortField: z.enum(['createdOn','email','firstName','lastName','orderCount','lastOrderOn']).optional(), sortDirection: z.enum(['ASCENDING','DESCENDING']).optional() }).strict(),
  contactUpdate: z.object({ contactId: id, firstName: z.string().trim().min(1).max(100).optional(), lastName: z.string().trim().min(1).max(100).optional(), locale: z.string().trim().min(2).max(35).optional(), primaryEmail: z.object({ email: z.string().email().max(320).optional(), acceptsMarketing: z.boolean().optional() }).strict().optional(), approvalToken }).strict().superRefine((v, ctx) => {
    if (v.firstName === undefined && v.lastName === undefined && v.locale === undefined && v.primaryEmail === undefined) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'At least one contact update field is required' });
  })
};

type Handler = (args: Record<string, unknown>) => Promise<unknown>;
export type ToolDefinition = { name: string; description: string; risk: string; inputSchema: Record<string, unknown>; handler: Handler };

function jsonSchema(properties: Record<string, unknown>, required: string[] = []): Record<string, unknown> {
  return { type: 'object', properties, required, additionalProperties: false };
}
const str = { type: 'string' };
const approval = { type: 'string', pattern: '^[0-9a-f]{64}$', description: 'Approval token minted outside the model context.' };

export function buildTools(client: SquarespaceClient, config: SquarespaceConfig): ToolDefinition[] {
  const wrap = <T>(name: string, schema: z.ZodType<T>, fn: (v: T) => Promise<unknown>): Handler => async raw => {
    const parsed = schema.parse(raw);
    enforcePolicy(config, name, parsed as Record<string, unknown>);
    const data = await fn(parsed);
    return { ok: true, untrustedProviderData: true, data };
  };

  const tools: ToolDefinition[] = [
    { name:'squarespace.order.list', description:'List Squarespace Commerce orders with bounded provider pagination and filters.', risk:TOOL_RISK['squarespace.order.list'], inputSchema:jsonSchema({ cursor:str, customerId:str, modifiedAfter:str, modifiedBefore:str, fulfillmentStatus:{type:'string'}, paymentStates:{type:'array',items:{type:'string'}} }), handler:wrap('squarespace.order.list', schemas.orderList, v => client.request('GET','/1.0/commerce/orders',{ query:{ cursor:v.cursor, customerId:v.customerId, modifiedAfter:v.modifiedAfter, modifiedBefore:v.modifiedBefore, fulfillmentStatus:v.fulfillmentStatus, paymentStates:v.paymentStates?.join(',') } })) },
    { name:'squarespace.order.get', description:'Get one Squarespace order.', risk:TOOL_RISK['squarespace.order.get'], inputSchema:jsonSchema({id:str},['id']), handler:wrap('squarespace.order.get', schemas.orderGet, v => client.request('GET',`/1.0/commerce/orders/${encodeURIComponent(v.id)}`)) },
    { name:'squarespace.order.fulfill', description:'Fulfill an order and optionally send a shipment notification. External customer notification makes this high risk.', risk:TOOL_RISK['squarespace.order.fulfill'], inputSchema:jsonSchema({id:str,shipments:{type:'array',items:{type:'object'}},shouldSendNotification:{type:'boolean'},approvalToken:approval},['id']), handler:wrap('squarespace.order.fulfill', schemas.orderFulfill, v => client.request('POST',`/1.0/commerce/orders/${encodeURIComponent(v.id)}/fulfillments`,{body:{shipments:v.shipments,shouldSendNotification:v.shouldSendNotification},retryable:false})) },
    { name:'squarespace.transaction.list', description:'List commerce transaction documents with cursor/date/order filters.', risk:TOOL_RISK['squarespace.transaction.list'], inputSchema:jsonSchema({cursor:str,modifiedAfter:str,modifiedBefore:str,orderId:str}), handler:wrap('squarespace.transaction.list', schemas.txList, v => client.request('GET','/1.0/commerce/transactions',{query:v})) },
    { name:'squarespace.transaction.get', description:'Get up to 50 transaction documents by ID.', risk:TOOL_RISK['squarespace.transaction.get'], inputSchema:jsonSchema({documentIds:{type:'array',items:str,maxItems:50}},['documentIds']), handler:wrap('squarespace.transaction.get', schemas.txGet, v => client.request('GET',`/1.0/commerce/transactions/${v.documentIds.map(encodeURIComponent).join(',')}`)) },
    { name:'squarespace.inventory.list', description:'List real-time inventory items using provider cursor pagination.', risk:TOOL_RISK['squarespace.inventory.list'], inputSchema:jsonSchema({cursor:str}), handler:wrap('squarespace.inventory.list', schemas.inventoryList, v => client.request('GET','/1.0/commerce/inventory',{query:v})) },
    { name:'squarespace.inventory.adjust', description:'Adjust stock quantities using Squarespace idempotency protection. Disabled unless high-risk operations are explicitly enabled.', risk:TOOL_RISK['squarespace.inventory.adjust'], inputSchema:jsonSchema({idempotencyKey:str,incrementOperations:{type:'array'},decrementOperations:{type:'array'},setFiniteOperations:{type:'array'},setUnlimitedOperations:{type:'array'},approvalToken:approval},['idempotencyKey']), handler:wrap('squarespace.inventory.adjust', schemas.inventoryAdjust, v => client.request('POST','/1.0/commerce/inventory/adjustments',{headers:{'Idempotency-Key':v.idempotencyKey},body:{incrementOperations:v.incrementOperations,decrementOperations:v.decrementOperations,setFiniteOperations:v.setFiniteOperations,setUnlimitedOperations:v.setUnlimitedOperations},retryable:false})) },
    { name:'squarespace.product.list', description:'List v2 products using cursor, date, query, and product-type filters.', risk:TOOL_RISK['squarespace.product.list'], inputSchema:jsonSchema({cursor:str,modifiedAfter:str,modifiedBefore:str,query:str,type:{type:'array',items:{type:'string'}}}), handler:wrap('squarespace.product.list', schemas.productList, v => client.request('GET','/v2/commerce/products',{query:{cursor:v.cursor,modifiedAfter:v.modifiedAfter,modifiedBefore:v.modifiedBefore,query:v.query,type:v.type?.join(',')}})) },
    { name:'squarespace.product.get', description:'Get up to 50 v2 products by ID.', risk:TOOL_RISK['squarespace.product.get'], inputSchema:jsonSchema({productIds:{type:'array',items:str,maxItems:50}},['productIds']), handler:wrap('squarespace.product.get', schemas.productGet, v => client.request('GET',`/v2/commerce/products/${v.productIds.map(encodeURIComponent).join(',')}`)) },
    { name:'squarespace.product.update', description:'Update a product name, description, or visibility through the v2 Products API.', risk:TOOL_RISK['squarespace.product.update'], inputSchema:jsonSchema({productId:str,name:str,description:str,isVisible:{type:'boolean'},approvalToken:approval},['productId']), handler:wrap('squarespace.product.update', schemas.productUpdate, v => client.request('POST',`/v2/commerce/products/${encodeURIComponent(v.productId)}`,{body:{name:v.name,description:v.description,isVisible:v.isVisible},retryable:false})) },
    { name:'squarespace.contact.list', description:'List contacts without unbounded pagination.', risk:TOOL_RISK['squarespace.contact.list'], inputSchema:jsonSchema({cursor:str,pageSize:{type:'integer',minimum:1,maximum:100}}), handler:wrap('squarespace.contact.list', schemas.contactList, v => client.request('GET','/v1/contacts',{query:v})) },
    { name:'squarespace.contact.get', description:'Get one contact by ID.', risk:TOOL_RISK['squarespace.contact.get'], inputSchema:jsonSchema({contactId:str},['contactId']), handler:wrap('squarespace.contact.get', schemas.contactGet, v => client.request('GET',`/v1/contacts/${encodeURIComponent(v.contactId)}`)) },
    { name:'squarespace.contact.query', description:'Search contacts by text with bounded pagination.', risk:TOOL_RISK['squarespace.contact.query'], inputSchema:jsonSchema({searchString:str,cursor:str,pageSize:{type:'integer',minimum:1,maximum:100},sortField:str,sortDirection:str},['searchString']), handler:wrap('squarespace.contact.query', schemas.contactQuery, v => client.request('POST','/v1/contacts/query',{body:v,retryable:true})) },
    { name:'squarespace.contact.update', description:'Update contact identity, locale, or marketing preference using JSON merge patch.', risk:TOOL_RISK['squarespace.contact.update'], inputSchema:jsonSchema({contactId:str,firstName:str,lastName:str,locale:str,primaryEmail:{type:'object'},approvalToken:approval},['contactId']), handler:wrap('squarespace.contact.update', schemas.contactUpdate, v => client.request('PATCH',`/v1/contacts/${encodeURIComponent(v.contactId)}`,{headers:{'Content-Type':'application/merge-patch+json'},body:{firstName:v.firstName,lastName:v.lastName,locale:v.locale,primaryEmail:v.primaryEmail},retryable:false})) }
  ];
  return tools;
}
