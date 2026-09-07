import { z } from "zod";
import type { ShippoClient } from "./client.js";
import type { Config } from "./config.js";
import { assertObjectId, authorize, cleanText, type Risk } from "./security.js";

export interface ToolDef { name: string; description: string; risk: Risk; schema: z.ZodTypeAny; handler: (args: any) => Promise<unknown>; }
const page = z.number().int().min(1).max(1000).default(1);
const results = z.number().int().min(1).max(100).default(20);
const address = z.object({ name: z.string().min(1).max(100), street1: z.string().min(1).max(200), street2: z.string().max(200).optional(), city: z.string().min(1).max(100), state: z.string().max(100).optional(), zip: z.string().min(1).max(20), country: z.string().length(2), phone: z.string().max(40).optional(), email: z.string().email().optional() }).strict();
const parcel = z.object({ length: z.string().min(1).max(20), width: z.string().min(1).max(20), height: z.string().min(1).max(20), distance_unit: z.enum(["cm", "in", "ft", "mm", "m", "yd"]), weight: z.string().min(1).max(20), mass_unit: z.enum(["g", "kg", "lb", "oz"]) }).strict();

export function buildTools(client: ShippoClient, config: Config): ToolDef[] {
  const read = (name: string, description: string, schema: z.ZodTypeAny, fn: (a: any) => Promise<unknown>): ToolDef => ({ name, description, risk: "READ", schema, handler: async raw => { const a = schema.parse(raw); authorize(config, name, "READ", a.approved); return fn(a); } });
  const write = (name: string, description: string, risk: Risk, schema: z.ZodTypeAny, fn: (a: any) => Promise<unknown>): ToolDef => ({ name, description, risk, schema, handler: async raw => { const a = schema.parse(raw); authorize(config, name, risk, a.approved); return fn(a); } });
  return [
    read("shippo.address.get", "Get an address by Shippo object ID.", z.object({ addressId: z.string() }).strict(), a => client.request("GET", `/addresses/${assertObjectId(a.addressId, "addressId")}/`)),
    read("shippo.address.list", "List addresses with bounded pagination.", z.object({ page, results }).strict(), a => client.list("/addresses/", a.page, a.results)),
    write("shippo.address.create", "Create and validate a reusable address.", "WRITE", z.object({ address, validate: z.boolean().default(true), approved: z.boolean().default(false) }).strict(), a => client.request("POST", "/addresses/", { ...a.address, validate: a.validate })),
    read("shippo.parcel.get", "Get a parcel by Shippo object ID.", z.object({ parcelId: z.string() }).strict(), a => client.request("GET", `/parcels/${assertObjectId(a.parcelId, "parcelId")}/`)),
    read("shippo.parcel.list", "List parcels with bounded pagination.", z.object({ page, results }).strict(), a => client.list("/parcels/", a.page, a.results)),
    write("shippo.parcel.create", "Create a parcel for rating or shipment workflows.", "WRITE", z.object({ parcel, approved: z.boolean().default(false) }).strict(), a => client.request("POST", "/parcels/", a.parcel)),
    write("shippo.shipment.create", "Create a shipment and obtain rates.", "WRITE", z.object({ addressFrom: address, addressTo: address, parcels: z.array(parcel).min(1).max(20), async: z.boolean().default(false), approved: z.boolean().default(false) }).strict(), a => client.request("POST", "/shipments/", { address_from: a.addressFrom, address_to: a.addressTo, parcels: a.parcels, async: a.async })),
    read("shippo.shipment.get", "Get shipment details and rates.", z.object({ shipmentId: z.string() }).strict(), a => client.request("GET", `/shipments/${assertObjectId(a.shipmentId, "shipmentId")}/`)),
    read("shippo.shipment.list", "List shipments with bounded pagination.", z.object({ page, results }).strict(), a => client.list("/shipments/", a.page, a.results)),
    read("shippo.rate.get", "Get one rate before label purchase.", z.object({ rateId: z.string() }).strict(), a => client.request("GET", `/rates/${assertObjectId(a.rateId, "rateId")}/`)),
    write("shippo.label.purchase", "Purchase a shipping label from a selected rate. This spends money and requires explicit approval.", "HIGH_RISK", z.object({ rateId: z.string(), labelFileType: z.enum(["PDF", "PDF_4x6", "PNG", "ZPLII"]).optional(), async: z.boolean().default(false), approved: z.boolean().default(false) }).strict(), a => client.request("POST", "/transactions/", { rate: assertObjectId(a.rateId, "rateId"), label_file_type: a.labelFileType, async: a.async })),
    read("shippo.transaction.get", "Get purchased label transaction status and metadata.", z.object({ transactionId: z.string() }).strict(), a => client.request("GET", `/transactions/${assertObjectId(a.transactionId, "transactionId")}/`)),
    read("shippo.transaction.list", "List label transactions with bounded pagination.", z.object({ page, results }).strict(), a => client.list("/transactions/", a.page, a.results)),
    write("shippo.refund.request", "Request a refund for a label transaction; explicit destructive approval is required.", "DESTRUCTIVE", z.object({ transactionId: z.string(), approved: z.boolean().default(false) }).strict(), a => client.request("POST", "/refunds/", { transaction: assertObjectId(a.transactionId, "transactionId") })),
    read("shippo.refund.get", "Get refund status.", z.object({ refundId: z.string() }).strict(), a => client.request("GET", `/refunds/${assertObjectId(a.refundId, "refundId")}/`)),
    read("shippo.track.get", "Get tracking status using a carrier and tracking number.", z.object({ carrier: z.string().min(1).max(50), trackingNumber: z.string().min(1).max(100) }).strict(), a => client.request("GET", `/tracks/${encodeURIComponent(cleanText(a.carrier, "carrier", 50))}/${encodeURIComponent(cleanText(a.trackingNumber, "trackingNumber", 100))}`))
  ];
}
