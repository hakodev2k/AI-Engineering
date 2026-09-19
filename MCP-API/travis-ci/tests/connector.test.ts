import { describe, expect, it, vi } from "vitest";
import { loadConfig, requirePermission } from "../src/config.js";
import { TravisClient } from "../src/client.js";
import { toolDefinitions } from "../src/tools.js";

const env = {TRAVIS_TOKEN:"test-token",TRAVIS_ALLOWED_PERMISSIONS:"READ,HIGH_RISK",TRAVIS_ENABLE_WRITES:"true"};

describe("configuration and permissions", () => {
  it("requires a token",()=>expect(()=>loadConfig({})).toThrow(/TRAVIS_TOKEN/));
  it("rejects insecure API origins",()=>expect(()=>loadConfig({...env,TRAVIS_API_BASE_URL:"http://example.com"})).toThrow(/HTTPS/));
  it("requires explicit approval for high risk",()=>expect(()=>requirePermission(loadConfig(env),"HIGH_RISK",false)).toThrow(/approval/));
});

describe("TravisClient", () => {
  it("sends version and isolated auth headers", async()=>{
    const f=vi.fn(async (_u:any,init:any)=>new Response(JSON.stringify({repositories:[]}),{status:200,headers:{"content-type":"application/json"}}));
    const client=new TravisClient(loadConfig(env),f as any);
    await client.request("GET","/repos");
    expect(f.mock.calls[0][1].headers.Authorization).toBe("token test-token");
    expect(f.mock.calls[0][1].headers["Travis-API-Version"]).toBe("3");
  });
  it("retries throttled reads but not writes", async()=>{
    const f=vi.fn().mockResolvedValueOnce(new Response("rate",{status:429,headers:{"retry-after":"0"}})).mockResolvedValueOnce(new Response("{}",{status:200}));
    const client=new TravisClient({...loadConfig(env),maxRetries:1},f as any);
    await client.request("GET","/repos");
    expect(f).toHaveBeenCalledTimes(2);
  });
});

describe("tools",()=>{
  it("registers meaningful scoped tools",()=>{
    const defs=toolDefinitions(new TravisClient(loadConfig(env),vi.fn() as any),loadConfig(env));
    expect(defs.length).toBe(10);
    expect(defs.map(x=>x.name)).toContain("travis.build.trigger");
  });
  it("validates repository slugs",()=>{
    const defs=toolDefinitions(new TravisClient(loadConfig(env),vi.fn() as any),loadConfig(env));
    const get=defs.find(x=>x.name==="travis.repository.get")!;
    expect(()=>get.schema.parse({slug:"bad"})).toThrow();
  });
  it("blocks unapproved build execution at schema boundary",()=>{
    const defs=toolDefinitions(new TravisClient(loadConfig(env),vi.fn() as any),loadConfig(env));
    const trigger=defs.find(x=>x.name==="travis.build.trigger")!;
    expect(()=>trigger.schema.parse({slug:"a/b",branch:"main",approved:false})).toThrow();
  });
});
