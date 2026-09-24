import { describe, expect, it, vi } from "vitest";
import { CalendlyClient } from "../src/client.js";
import { invoke, tools } from "../src/tools.js";

const env:any={CALENDLY_ACCESS_TOKEN:"test",CALENDLY_API_BASE_URL:"https://api.calendly.com",CALENDLY_TIMEOUT_MS:"20",CALENDLY_MAX_RETRIES:"1",CONNECTOR_ALLOW_WRITES:"false"};

describe("Calendly connector",()=>{
 it("registers ten scoped tools",()=>expect(tools).toHaveLength(10));
 it("reads current user without exposing token",async()=>{const f=vi.fn(async (_u:any,init:any)=>new Response(JSON.stringify({resource:{uri:"u"}}),{status:200,headers:{"content-type":"application/json"}})); const out=await invoke("calendly.user.get",{},new CalendlyClient(f as any,env)); expect(out.resource.uri).toBe("u"); expect(f.mock.calls[0][1].headers.Authorization).toBe("Bearer test");});
 it("rejects ambiguous list input",async()=>{await expect(invoke("calendly.event_type.list",{},new CalendlyClient(vi.fn() as any,env))).rejects.toThrow();});
 it("denies writes when disabled",async()=>{await expect(invoke("calendly.scheduling_link.create",{event_type_uri:"https://api.calendly.com/event_types/ABC",approved:true},new CalendlyClient(vi.fn() as any,env))).rejects.toThrow("WRITE_DISABLED");});
 it("requires explicit approval schema",async()=>{await expect(invoke("calendly.scheduled_event.cancel",{event_uri:"https://api.calendly.com/scheduled_events/ABC"},new CalendlyClient(vi.fn() as any,{...env,CONNECTOR_ALLOW_WRITES:"true"}))).rejects.toThrow();});
 it("retries 429 read once",async()=>{const f=vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({message:"slow"}),{status:429,headers:{"x-ratelimit-reset":"0"}})).mockResolvedValueOnce(new Response(JSON.stringify({resource:{ok:true}}),{status:200})); const out=await invoke("calendly.user.get",{},new CalendlyClient(f as any,env)); expect(out.resource.ok).toBe(true); expect(f).toHaveBeenCalledTimes(2);});
 it("does not retry write",async()=>{const f=vi.fn(async()=>new Response(JSON.stringify({message:"down"}),{status:500})); const c=new CalendlyClient(f as any,{...env,CONNECTOR_ALLOW_WRITES:"true"}); await expect(invoke("calendly.scheduling_link.create",{event_type_uri:"https://api.calendly.com/event_types/ABC",approved:true},c)).rejects.toThrow("down"); expect(f).toHaveBeenCalledTimes(1);});
 it("maps timeout",async()=>{const f=vi.fn((_u:any,init:any)=>new Promise((_r,reject)=>init.signal.addEventListener("abort",()=>reject(Object.assign(new Error("x"),{name:"AbortError"}))))); await expect(invoke("calendly.user.get",{},new CalendlyClient(f as any,{...env,CALENDLY_TIMEOUT_MS:"1"}))).rejects.toThrow("CALENDLY_TIMEOUT");});
});
