import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";
import { assertAllowed } from "../src/policy.js";
import { ShortcutApiError, ShortcutClient } from "../src/client.js";
import { TOOLS, TOOL_MAP } from "../src/tools.js";

test("configuration defaults to read-only and isolates token",()=>{
 const c=loadConfig({SHORTCUT_API_TOKEN:"secret"});
 assert.equal(c.token,"secret"); assert.equal(c.permissions.has("READ"),true); assert.equal(c.permissions.has("WRITE"),false); assert.equal(c.requireWriteApproval,true);
});

test("invalid API base URL is rejected to prevent SSRF",()=>{
 assert.throws(()=>loadConfig({SHORTCUT_API_TOKEN:"x",SHORTCUT_API_BASE_URL:"https://evil.example/api"}),/api\.app\.shortcut\.com/);
});

test("tool registry exposes exactly the implemented contracts",()=>{
 assert.equal(TOOLS.length,12); for(const t of TOOLS) assert.equal(TOOL_MAP.get(t.name),t);
 assert.equal(TOOL_MAP.has("shortcut.story.create"),true); assert.equal(TOOL_MAP.has("shortcut.repository.delete"),false);
});

test("strict validation rejects ambiguous create story input",()=>{
 const schema=TOOL_MAP.get("shortcut.story.create")!.schema;
 assert.equal(schema.safeParse({name:"Bug",storyType:"bug"}).success,false);
 assert.equal(schema.safeParse({name:"Bug",storyType:"bug",workflowStateId:1,unknown:true}).success,false);
});

test("write permission and approval are independently enforced",()=>{
 const read=loadConfig({SHORTCUT_API_TOKEN:"x"});
 assert.throws(()=>assertAllowed("WRITE","shortcut.story.create",{approved:true},read),/WRITE permission/);
 const write=loadConfig({SHORTCUT_API_TOKEN:"x",SHORTCUT_PERMISSIONS:"write"});
 assert.throws(()=>assertAllowed("WRITE","shortcut.story.create",{},write),/explicit human approval/);
 assert.doesNotThrow(()=>assertAllowed("WRITE","shortcut.story.create",{approved:true},write));
});

test("client sends Shortcut-Token, parses JSON, and preserves query",async()=>{
 const config=loadConfig({SHORTCUT_API_TOKEN:"secret",SHORTCUT_MAX_RETRIES:"0"});
 let seen:RequestInit|undefined; let seenUrl="";
 const fake=async(input:RequestInfo|URL,init?:RequestInit)=>{seen=init;seenUrl=String(input);return new Response(JSON.stringify({ok:true}),{status:200,headers:{"content-type":"application/json"}});};
 const client=new ShortcutClient(config,fake as typeof fetch); const r=await client.request<{ok:boolean}>("GET","/search/stories",undefined,{query:"owner:me",page_size:10});
 assert.equal(r.ok,true); assert.equal(new Headers(seen?.headers).get("Shortcut-Token"),"secret"); assert.match(seenUrl,/query=owner%3Ame/);
});

test("client maps API failures and does not retry authentication errors",async()=>{
 const config=loadConfig({SHORTCUT_API_TOKEN:"bad",SHORTCUT_MAX_RETRIES:"2"}); let calls=0;
 const fake=async()=>{calls++;return new Response(JSON.stringify({message:"Unauthorized"}),{status:401});};
 const client=new ShortcutClient(config,fake as typeof fetch);
 await assert.rejects(()=>client.request("GET","/workflows"),e=>e instanceof ShortcutApiError&&e.status===401); assert.equal(calls,1);
});

test("client retries 429 with bounded retry count",async()=>{
 const config=loadConfig({SHORTCUT_API_TOKEN:"x",SHORTCUT_MAX_RETRIES:"1"}); let calls=0;
 const fake=async()=>{calls++;return calls===1?new Response(JSON.stringify({message:"rate"}),{status:429,headers:{"retry-after":"0"}}):new Response(JSON.stringify({ok:true}),{status:200});};
 const client=new ShortcutClient(config,fake as typeof fetch); const r=await client.request<{ok:boolean}>("GET","/workflows"); assert.equal(r.ok,true); assert.equal(calls,2);
});
