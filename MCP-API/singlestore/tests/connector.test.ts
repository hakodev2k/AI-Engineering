import test from "node:test";
import assert from "node:assert/strict";
import { SingleStoreClient, SingleStoreError } from "../src/client.js";
import { buildTools } from "../src/tools.js";
import { ApprovalRequiredError, PermissionDeniedError } from "../src/policy.js";

const response = (status:number, body:any, headers:Record<string,string>={}) => new Response(JSON.stringify(body),{status,headers});

test("auth configuration rejects empty API key",()=>assert.throws(()=>new SingleStoreClient({apiKey:""})));
test("base URL must use HTTPS",()=>assert.throws(()=>new SingleStoreClient({apiKey:"x",baseUrl:"http://example.com"})));
test("tool registration exposes nine scoped tools",()=>{const c:any={request:async()=>({})};assert.equal(buildTools(c,{approveWrites:false,approveHighRisk:false,allowDestructive:false}).length,9);});
test("strict validation rejects malformed UUID",async()=>{const c:any={request:async()=>({})};const t=buildTools(c,{approveWrites:false,approveHighRisk:false,allowDestructive:false}).find(x=>x.name.endsWith("workspace.get"))!;assert.throws(()=>t.schema.parse({workspaceId:"bad"}));});
test("read operation maps to provider path",async()=>{let path="";const c:any={request:async(p:string)=>{path=p;return {ok:true}}};const t=buildTools(c,{approveWrites:false,approveHighRisk:false,allowDestructive:false})[0];await t.run({});assert.equal(path,"/v1/regions");});
test("high-risk suspend requires explicit approval and policy",async()=>{const c:any={request:async()=>({})};const t=buildTools(c,{approveWrites:true,approveHighRisk:true,allowDestructive:false}).find(x=>x.name.endsWith("suspend"))!;await assert.rejects(()=>t.run({workspaceId:"11111111-1111-4111-8111-111111111111",approved:false}),ApprovalRequiredError);});
test("destructive delete is disabled by default",async()=>{const c:any={request:async()=>({})};const t=buildTools(c,{approveWrites:true,approveHighRisk:true,allowDestructive:false}).find(x=>x.name.endsWith("delete"))!;await assert.rejects(()=>t.run({workspaceId:"11111111-1111-4111-8111-111111111111",approved:true}),PermissionDeniedError);});
test("provider errors are mapped without leaking token",async()=>{const c=new SingleStoreClient({apiKey:"secret",fetchImpl:async()=>response(401,{message:"unauthorized"}) as any});await assert.rejects(()=>c.request("/v1/regions"),(e:any)=>e instanceof SingleStoreError&&e.status===401&&!e.message.includes("secret"));});
test("429 GET retries and honors eventual success",async()=>{let n=0;const c=new SingleStoreClient({apiKey:"x",fetchImpl:async()=>{n++;return n<2?response(429,{message:"slow"},{"retry-after":"0"}) as any:response(200,{regions:[]}) as any}});await c.request("/v1/regions");assert.equal(n,2);});
test("pagination data is returned intact for caller-controlled continuation",async()=>{const c=new SingleStoreClient({apiKey:"x",fetchImpl:async()=>response(200,{workspaces:[1],nextToken:"abc"}) as any});assert.deepEqual(await c.request("/v1/workspaces"),{workspaces:[1],nextToken:"abc"});});
