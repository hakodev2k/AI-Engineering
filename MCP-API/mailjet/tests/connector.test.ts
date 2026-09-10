import { describe,it,expect,vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { MailjetClient,MailjetError } from "../src/client.js";
import { buildTools } from "../src/tools.js";

const cfg={apiKey:"key",secretKey:"secret",apiBase:"https://api.mailjet.com",timeoutMs:1000,maxRetries:0,requireWriteApproval:true,enableDestructive:false};

describe("config",()=>{
 it("requires credentials",()=>expect(()=>loadConfig({})).toThrow());
 it("rejects non-https base",()=>expect(()=>loadConfig({MAILJET_API_KEY:"a",MAILJET_SECRET_KEY:"b",MAILJET_API_BASE:"http://example.com"})).toThrow());
});
describe("tools",()=>{
 it("registers useful scoped tools",()=>{const c=new MailjetClient(cfg,vi.fn() as any);expect(buildTools(c,cfg).length).toBeGreaterThanOrEqual(8);});
 it("requires approval for writes",async()=>{const c=new MailjetClient(cfg,vi.fn() as any);const t=buildTools(c,cfg).find(x=>x.name==="mailjet.contact.create")!;await expect(t.run({email:"a@example.com"})).rejects.toThrow(/approval/i);});
 it("validates email input",async()=>{const c=new MailjetClient(cfg,vi.fn() as any);const t=buildTools(c,cfg).find(x=>x.name==="mailjet.contact.create")!;await expect(t.run({email:"bad",approved:true})).rejects.toThrow();});
});
describe("client",()=>{
 it("maps provider errors",async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({ErrorMessage:"denied"}),{status:403}));const c=new MailjetClient(cfg,f as any);await expect(c.request("GET","/v3/REST/contact")).rejects.toBeInstanceOf(MailjetError);});
 it("sends basic auth without exposing credentials in URL",async()=>{const f=vi.fn().mockResolvedValue(new Response(JSON.stringify({Data:[]}),{status:200,headers:{"content-type":"application/json"}}));const c=new MailjetClient(cfg,f as any);await c.request("GET","/v3/REST/contact");const [url,init]=f.mock.calls[0];expect(String(url)).not.toContain("secret");expect(init.headers.Authorization).toMatch(/^Basic /);});
 it("does not retry POST by default",async()=>{const f=vi.fn().mockResolvedValue(new Response("fail",{status:500}));const c=new MailjetClient({...cfg,maxRetries:2},f as any);await expect(c.request("POST","/v3/REST/contact",{body:{Email:"a@example.com"}})).rejects.toThrow();expect(f).toHaveBeenCalledTimes(1);});
});
