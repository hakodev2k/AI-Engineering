import test from "node:test";
import assert from "node:assert/strict";
import { ToolRouter,tools } from "../src/tools.js";
import { assertDateRange,ValidationError } from "../src/security.js";

class FakeClient{calls:any[]=[];async query(path:string,q:URLSearchParams){this.calls.push(["query",path,q.toString()]);return {ok:true};}async export(q:URLSearchParams){this.calls.push(["export",q.toString()]);return [{event:"x"}];}}

test("registers ten unique read tools",()=>{assert.equal(tools.length,10);assert.equal(new Set(tools.map(t=>t.name)).size,10);assert.ok(tools.every(t=>t.annotations.readOnlyHint===true));});
test("date range validation rejects reversed and oversized windows",()=>{assert.throws(()=>assertDateRange("2026-09-10","2026-09-01"),ValidationError);assert.throws(()=>assertDateRange("2026-01-01","2026-03-01",31),ValidationError);});
test("raw export is bounded and passes project-safe query",async()=>{const c=new FakeClient();const r=new ToolRouter(c as any);const out=await r.execute("mixpanel.events.export",{fromDate:"2026-09-01",toDate:"2026-09-02",event:"Signup",limit:50});assert.equal(out.untrustedProviderData,true);assert.match(c.calls[0][1],/from_date=2026-09-01/);});
test("funnel query validates id and range",async()=>{const c=new FakeClient();const r=new ToolRouter(c as any);await r.execute("mixpanel.funnel.query",{funnelId:7,fromDate:"2026-09-01",toDate:"2026-09-07"});assert.equal(c.calls[0][1],"/api/2.0/funnels");});
test("segmentation validates event allowlist",async()=>{process.env.MIXPANEL_ALLOWED_EVENTS="Signup,Purchase";const r=new ToolRouter(new FakeClient() as any);await assert.rejects(()=>r.execute("mixpanel.segmentation.query",{event:"Admin Secret",fromDate:"2026-09-01",toDate:"2026-09-02"}),ValidationError);delete process.env.MIXPANEL_ALLOWED_EVENTS;});
test("unknown tool fails locally",async()=>{await assert.rejects(()=>new ToolRouter(new FakeClient() as any).execute("mixpanel.any.request",{}),ValidationError);});
