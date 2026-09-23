import { afterEach, describe, expect, it, vi } from "vitest";
import { AirbrakeClient } from "../src/client.js";
import { ApprovalError, requireApproval } from "../src/security.js";
afterEach(()=>{ vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe("approval",()=>{
  it("denies writes by default",()=>expect(()=>requireApproval(true)).toThrow(ApprovalError));
  it("requires explicit approval",()=>{vi.stubEnv("AIRBRAKE_WRITE_ENABLED","true");expect(()=>requireApproval(false)).toThrow(ApprovalError);});
  it("allows enabled approved write",()=>{vi.stubEnv("AIRBRAKE_WRITE_ENABLED","true");expect(()=>requireApproval(true)).not.toThrow();});
});
describe("client",()=>{
  it("fails without credential",async()=>{await expect(new AirbrakeClient().request("/projects")).rejects.toThrow("AIRBRAKE_USER_KEY");});
  it("does not retry auth errors",async()=>{vi.stubEnv("AIRBRAKE_USER_KEY","secret");const f=vi.fn().mockResolvedValue(new Response("denied",{status:403}));await expect(new AirbrakeClient(f as typeof fetch).request("/projects")).rejects.toThrow("403");expect(f).toHaveBeenCalledTimes(1);});
  it("retries throttled reads",async()=>{vi.stubEnv("AIRBRAKE_USER_KEY","secret");const f=vi.fn().mockResolvedValueOnce(new Response("slow",{status:429})).mockResolvedValueOnce(new Response(JSON.stringify({projects:[]}),{status:200,headers:{"content-type":"application/json"}}));await expect(new AirbrakeClient(f as typeof fetch).request("/projects")).resolves.toEqual({projects:[]});expect(f).toHaveBeenCalledTimes(2);});
  it("never puts user key in request body",async()=>{vi.stubEnv("AIRBRAKE_USER_KEY","secret");const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({projects:[]}),{status:200,headers:{"content-type":"application/json"}}));await new AirbrakeClient(f as typeof fetch).request("/projects");expect(f.mock.calls[0][1].body).toBeUndefined();});
  it("does not retry writes",async()=>{vi.stubEnv("AIRBRAKE_USER_KEY","secret");const f=vi.fn().mockResolvedValue(new Response("slow",{status:500}));await expect(new AirbrakeClient(f as typeof fetch).request("/projects/1/groups/2/muted","PUT")).rejects.toThrow("500");expect(f).toHaveBeenCalledTimes(1);});
});
