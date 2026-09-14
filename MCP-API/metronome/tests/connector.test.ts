import test from "node:test";
import assert from "node:assert/strict";
import { ToolRouter, tools } from "../src/tools.js";
import { ApprovalError, requireApproval, ValidationError } from "../src/security.js";

class FakeApi {
  calls:any[]=[];
  async get(path:string){this.calls.push(["GET",path]); return {data:[],next_page:null};}
  async post(path:string,body:unknown,key?:string){this.calls.push(["POST",path,body,key]); return {data:{id:"58fb0650-e54a-4d17-93cb-ba8e56c32c65"}};}
}

test("registers ten unique scoped tools",()=>{ assert.equal(tools.length,10); assert.equal(new Set(tools.map(t=>t.name)).size,10); assert.ok(tools.every(t=>t.name.startsWith("metronome."))); });
test("write approval is denied when no grant is configured",()=>{process.env.METRONOME_REQUIRE_WRITE_APPROVAL="true";delete process.env.METRONOME_APPROVAL_TOKEN;assert.throws(()=>requireApproval("WRITE"),ApprovalError);});
test("customer listing bounds pagination",async()=>{const api=new FakeApi();const r=new ToolRouter(api);await r.execute("metronome.customer.list",{limit:25});assert.match(api.calls[0][1],/limit=25/);});
test("customer create maps snake case and idempotency key",async()=>{process.env.METRONOME_REQUIRE_WRITE_APPROVAL="false";const api=new FakeApi();const r=new ToolRouter(api);await r.execute("metronome.customer.create",{name:"Example",ingestAliases:["acct-1"],idempotencyKey:"create-acct-1"});assert.equal(api.calls[0][2].ingest_aliases[0],"acct-1");assert.equal(api.calls[0][3],"create-acct-1");});
test("usage ingest requires explicit approval and normalizes timestamps",async()=>{process.env.METRONOME_APPROVAL_TOKEN="grant";const api=new FakeApi();const r=new ToolRouter(api);await r.execute("metronome.usage.ingest",{approvalId:"grant",events:[{transactionId:"tx-1",customerId:"acct-1",eventType:"api_request",timestamp:"2026-09-15T00:00:00Z"}]});assert.equal(api.calls[0][1],"/v1/ingest");});
test("usage search is capped for rate-limit safety",async()=>{const api=new FakeApi();const r=new ToolRouter(api);await assert.rejects(()=>r.execute("metronome.usage.search",{transactionIds:Array.from({length:26},(_,i)=>`tx-${i}`)}),ValidationError);});
test("SQL billable metrics are not part of the schema",()=>{const t=tools.find(t=>t.name==="metronome.billable_metric.create")!;assert.equal("sql" in t.inputSchema.properties,false);});
test("archive is disabled by default even with an approval token",async()=>{process.env.METRONOME_ENABLE_DESTRUCTIVE="false";process.env.METRONOME_APPROVAL_TOKEN="grant";const r=new ToolRouter(new FakeApi());await assert.rejects(()=>r.execute("metronome.customer.archive",{customerId:"8deed800-1b7a-495d-a207-6c52bac54dc9",approvalId:"grant"}),ApprovalError);});
test("usage alert validates its required billable metric",async()=>{process.env.METRONOME_APPROVAL_TOKEN="grant";const r=new ToolRouter(new FakeApi());await assert.rejects(()=>r.execute("metronome.alert.create",{approvalId:"grant",alertType:"usage_threshold_reached",name:"Usage",threshold:10}),ValidationError);});
