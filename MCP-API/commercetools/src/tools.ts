import {z} from 'zod';import type {CommerceClient} from './client.js';import type {Config} from './config.js';
export const schemas={productSearch:z.object({text:z.string().min(1).max(256),limit:z.number().int().min(1).max(100).default(20)}),id:z.object({id:z.string().min(1).max(100)}),list:z.object({limit:z.number().int().min(1).max(100).default(20),offset:z.number().int().min(0).max(10000).default(0)}),cartCreate:z.object({currency:z.string().regex(/^[A-Z]{3}$/),country:z.string().regex(/^[A-Z]{2}$/).optional(),approved:z.boolean().default(false)}),addLine:z.object({cartId:z.string(),version:z.number().int().min(1),sku:z.string().min(1),quantity:z.number().int().min(1).max(1000).default(1),approved:z.boolean().default(false)})};
const q=(v:string)=>encodeURIComponent(v);const approve=(c:Config,a:boolean)=>{if(!c.approveWrites||!a)throw new Error('WRITE_REQUIRES_EXPLICIT_APPROVAL')};
export function handlers(client:CommerceClient,c:Config){return{
'commercetools.product.search':async(i:unknown)=>{const x=schemas.productSearch.parse(i);return client.request('GET',`/product-projections/search?text.en=${q(x.text)}&limit=${x.limit}`)},
'commercetools.product.get':async(i:unknown)=>client.request('GET',`/products/${q(schemas.id.parse(i).id)}`),
'commercetools.category.list':async(i:unknown)=>{const x=schemas.list.parse(i);return client.request('GET',`/categories?limit=${x.limit}&offset=${x.offset}`)},
'commercetools.cart.get':async(i:unknown)=>client.request('GET',`/carts/${q(schemas.id.parse(i).id)}`),
'commercetools.cart.create':async(i:unknown)=>{const x=schemas.cartCreate.parse(i);approve(c,x.approved);return client.request('POST','/carts',{currency:x.currency,...(x.country?{country:x.country}:{})})},
'commercetools.cart.add_line_item':async(i:unknown)=>{const x=schemas.addLine.parse(i);approve(c,x.approved);return client.request('POST',`/carts/${q(x.cartId)}`,{version:x.version,actions:[{action:'addLineItem',sku:x.sku,quantity:x.quantity}]})},
'commercetools.order.get':async(i:unknown)=>client.request('GET',`/orders/${q(schemas.id.parse(i).id)}`),
'commercetools.order.list':async(i:unknown)=>{const x=schemas.list.parse(i);return client.request('GET',`/orders?limit=${x.limit}&offset=${x.offset}`)},
'commercetools.customer.get':async(i:unknown)=>client.request('GET',`/customers/${q(schemas.id.parse(i).id)}`),
'commercetools.inventory.get':async(i:unknown)=>client.request('GET',`/inventory/${q(schemas.id.parse(i).id)}`)}}}
export const risks:Record<string,string>={'commercetools.cart.create':'WRITE','commercetools.cart.add_line_item':'WRITE'};
