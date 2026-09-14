import { MetronomeClient } from "./client.js";
import { boundedInt, idempotencyKey, isoDate, nonEmpty, requireApproval, type Risk, uuid, ValidationError } from "./security.js";

type Api = Pick<MetronomeClient, "get" | "post">;
export type ToolSpec = { name: string; description: string; risk: Risk; inputSchema: any; annotations: any };
const str = (description: string, maxLength = 256) => ({ type: "string", minLength: 1, maxLength, description });
const obj = (properties: any, required: string[] = []) => ({ type: "object", additionalProperties: false, properties, required });
const approval = { approvalId: str("Opaque human approval grant injected by the MCP host.", 256) };
const idem = { idempotencyKey: str("Optional Metronome Idempotency-Key; reuse only for an identical POST.", 128) };

export const tools: ToolSpec[] = [
  { name:"metronome.customer.list", risk:"READ", description:"READ: list active or archived customers using cursor pagination and optional ingest-alias filtering.", inputSchema:obj({limit:{type:"integer",minimum:1,maximum:100},nextPage:str("Opaque next_page cursor.",512),ingestAlias:str("Exact ingest alias.",128),onlyArchived:{type:"boolean"}}), annotations:{readOnlyHint:true}},
  { name:"metronome.customer.create", risk:"WRITE", description:"WRITE: create a customer with bounded ingest aliases and optional custom fields.", inputSchema:obj({name:str("Customer display name.",160),ingestAliases:{type:"array",maxItems:50,items:str("Ingest alias.",128)},customFields:{type:"object",maxProperties:50,additionalProperties:{type:["string","number","boolean"]}},...idem,...approval},["name"]), annotations:{readOnlyHint:false}},
  { name:"metronome.customer.archive", risk:"DESTRUCTIVE", description:"DESTRUCTIVE: irreversibly archive a customer; Metronome also archives contracts and voids corresponding invoices.", inputSchema:obj({customerId:str("Customer UUID.",64),...idem,...approval},["customerId","approvalId"]), annotations:{readOnlyHint:false,destructiveHint:true}},
  { name:"metronome.usage.ingest", risk:"HIGH_RISK", description:"HIGH_RISK: ingest 1-100 usage events that can change billable usage, balances, and invoices.", inputSchema:obj({events:{type:"array",minItems:1,maxItems:100,items:obj({transactionId:str("Unique transaction ID; Metronome deduplicates for 34 days.",128),customerId:str("Metronome customer ID or ingest alias.",256),eventType:str("Usage event type.",128),timestamp:str("RFC 3339 timestamp.",64),properties:{type:"object",maxProperties:100,additionalProperties:{type:["string","number","boolean","null"]}}},["transactionId","customerId","eventType","timestamp"])},...idem,...approval},["events","approvalId"]), annotations:{readOnlyHint:false}},
  { name:"metronome.usage.search", risk:"READ", description:"READ: sample events by transaction ID for integration validation; this provider endpoint is heavily rate-limited and is not for exhaustive polling.", inputSchema:obj({transactionIds:{type:"array",minItems:1,maxItems:25,uniqueItems:true,items:str("Transaction ID from the last 34 days.",128)}} ,["transactionIds"]), annotations:{readOnlyHint:true}},
  { name:"metronome.billable_metric.list", risk:"READ", description:"READ: list billable metrics with bounded cursor pagination.", inputSchema:obj({limit:{type:"integer",minimum:1,maximum:100},nextPage:str("Opaque next_page cursor.",512),includeArchived:{type:"boolean"}}), annotations:{readOnlyHint:true}},
  { name:"metronome.billable_metric.create", risk:"HIGH_RISK", description:"HIGH_RISK: create a standard streaming billable metric. Arbitrary SQL metrics are intentionally not exposed.", inputSchema:obj({name:str("Metric display name.",160),eventTypes:{type:"array",minItems:1,maxItems:20,uniqueItems:true,items:str("Event type to include.",128)},aggregationType:{type:"string",enum:["COUNT","SUM","MAX","UNIQUE","LATEST"]},aggregationKey:str("Event property to aggregate.",128),groupKeys:{type:"array",maxItems:10,items:{type:"array",minItems:1,maxItems:5,items:str("Grouping property.",128)}},...idem,...approval},["name","eventTypes","aggregationType","approvalId"]), annotations:{readOnlyHint:false}},
  { name:"metronome.invoice.list", risk:"READ", description:"READ: list invoices for one customer using Metronome's customer invoice endpoint.", inputSchema:obj({customerId:str("Customer UUID.",64)},["customerId"]), annotations:{readOnlyHint:true}},
  { name:"metronome.alert.create", risk:"HIGH_RISK", description:"HIGH_RISK: create a threshold notification that can drive billing/operational workflows.", inputSchema:obj({alertType:{type:"string",enum:["spend_threshold_reached","monthly_invoice_total_spend_threshold_reached","usage_threshold_reached","invoice_total_reached"]},name:str("Notification name.",160),threshold:{type:"number"},customerId:str("Optional customer UUID.",64),billableMetricId:str("Required for usage-threshold notifications.",64),uniquenessKey:str("Optional uniqueness key.",128),evaluateOnCreate:{type:"boolean"},...idem,...approval},["alertType","name","threshold","approvalId"]), annotations:{readOnlyHint:false}},
  { name:"metronome.contract.create", risk:"HIGH_RISK", description:"HIGH_RISK: create a customer contract from an existing rate card and start time. This establishes billing terms.", inputSchema:obj({customerId:str("Customer UUID.",64),rateCardId:str("Rate card UUID.",64),startingAt:str("RFC 3339 contract start.",64),...idem,...approval},["customerId","rateCardId","startingAt","approvalId"]), annotations:{readOnlyHint:false}}
];

export class ToolRouter {
  constructor(private readonly api: Api = new MetronomeClient()) {}
  async execute(name: string, a: any = {}): Promise<unknown> {
    const spec = tools.find(t => t.name === name); if (!spec) throw new ValidationError("Unknown tool.");
    requireApproval(spec.risk, a.approvalId);
    switch (name) {
      case "metronome.customer.list": {
        const q = new URLSearchParams({ limit:String(boundedInt(a.limit,50,1,100)) });
        if (a.nextPage) q.set("next_page", nonEmpty(a.nextPage,"nextPage",512));
        if (a.ingestAlias) q.set("ingest_alias", nonEmpty(a.ingestAlias,"ingestAlias",128));
        if (a.onlyArchived != null) q.set("only_archived", String(Boolean(a.onlyArchived)));
        return this.api.get(`/v1/customers?${q}`);
      }
      case "metronome.customer.create": return this.api.post("/v1/customers", { name:nonEmpty(a.name,"name",160), ...(a.ingestAliases ? {ingest_aliases:a.ingestAliases.map((x:unknown)=>nonEmpty(x,"ingestAlias",128))} : {}), ...(a.customFields ? {custom_fields:a.customFields} : {}) }, idempotencyKey(a.idempotencyKey));
      case "metronome.customer.archive": return this.api.post("/v1/customers/archive", { id:uuid(a.customerId,"customerId") }, idempotencyKey(a.idempotencyKey));
      case "metronome.usage.ingest": {
        if (!Array.isArray(a.events) || a.events.length < 1 || a.events.length > 100) throw new ValidationError("events must contain 1-100 entries.");
        const events = a.events.map((e:any)=>({ transaction_id:nonEmpty(e.transactionId,"transactionId",128), customer_id:nonEmpty(e.customerId,"customerId",256), event_type:nonEmpty(e.eventType,"eventType",128), timestamp:isoDate(e.timestamp,"timestamp"), ...(e.properties ? {properties:e.properties} : {}) }));
        return this.api.post("/v1/ingest", events, idempotencyKey(a.idempotencyKey));
      }
      case "metronome.usage.search": {
        if (!Array.isArray(a.transactionIds) || a.transactionIds.length < 1 || a.transactionIds.length > 25) throw new ValidationError("transactionIds must contain 1-25 entries.");
        return this.api.post("/v1/events/search", { transactionIds:a.transactionIds.map((x:unknown)=>nonEmpty(x,"transactionId",128)) });
      }
      case "metronome.billable_metric.list": {
        const q = new URLSearchParams({ limit:String(boundedInt(a.limit,50,1,100)), include_archived:String(Boolean(a.includeArchived)) });
        if (a.nextPage) q.set("next_page", nonEmpty(a.nextPage,"nextPage",512));
        return this.api.get(`/v1/billable-metrics?${q}`);
      }
      case "metronome.billable_metric.create": {
        const type = String(a.aggregationType || "").toUpperCase();
        if (!["COUNT","SUM","MAX","UNIQUE","LATEST"].includes(type)) throw new ValidationError("Unsupported aggregationType.");
        if (type !== "COUNT" && !a.aggregationKey) throw new ValidationError("aggregationKey is required unless aggregationType is COUNT.");
        return this.api.post("/v1/billable-metrics/create", { name:nonEmpty(a.name,"name",160), event_type_filter:{in_values:a.eventTypes.map((x:unknown)=>nonEmpty(x,"eventType",128))}, aggregation_type:type, ...(a.aggregationKey ? {aggregation_key:nonEmpty(a.aggregationKey,"aggregationKey",128)} : {}), ...(a.groupKeys ? {group_keys:a.groupKeys} : {}) }, idempotencyKey(a.idempotencyKey));
      }
      case "metronome.invoice.list": return this.api.get(`/v1/customers/${uuid(a.customerId,"customerId")}/invoices`);
      case "metronome.alert.create": {
        const body:any={ alert_type:a.alertType, name:nonEmpty(a.name,"name",160), threshold:Number(a.threshold), evaluate_on_create:a.evaluateOnCreate ?? true };
        if (!Number.isFinite(body.threshold)) throw new ValidationError("threshold must be numeric.");
        if (a.customerId) body.customer_id=uuid(a.customerId,"customerId");
        if (a.billableMetricId) body.billable_metric_id=uuid(a.billableMetricId,"billableMetricId");
        if (a.alertType === "usage_threshold_reached" && !body.billable_metric_id) throw new ValidationError("billableMetricId is required for usage_threshold_reached.");
        if (a.uniquenessKey) body.uniqueness_key=nonEmpty(a.uniquenessKey,"uniquenessKey",128);
        return this.api.post("/v1/alerts/create",body,idempotencyKey(a.idempotencyKey));
      }
      case "metronome.contract.create": return this.api.post("/v1/contracts/create", {customer_id:uuid(a.customerId,"customerId"),rate_card_id:uuid(a.rateCardId,"rateCardId"),starting_at:isoDate(a.startingAt,"startingAt")},idempotencyKey(a.idempotencyKey));
      default: throw new ValidationError("Tool not implemented.");
    }
  }
}
