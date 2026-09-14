import test from "node:test";
import assert from "node:assert/strict";
import { assertPublicHttpsUrl, requireApproval, ValidationError, ApprovalError } from "../src/security.js";
import { ToolRouter, tools } from "../src/tools.js";

class FakeApi {
  calls:any[]=[]; available(){return true;}
  async get(path:string){this.calls.push(["GET",path]); return {data:[]};}
  async post(path:string,body?:unknown){this.calls.push(["POST",path,body]); return {data:{id:"job-1"}};}
  async delete(path:string){this.calls.push(["DELETE",path]); return null;}
}
class FakeMcp { async callIfCompatible(){ return {handled:false}; } }

test("registers meaningful tool set", () => { assert.equal(tools.length,13); assert.equal(new Set(tools.map(t=>t.name)).size,13); });
test("rejects non-HTTPS and local URLs", () => { assert.throws(()=>assertPublicHttpsUrl("http://example.com/a.pdf"),ValidationError); assert.throws(()=>assertPublicHttpsUrl("https://127.0.0.1/a.pdf"),ValidationError); });
test("allows a public HTTPS URL", () => { assert.match(assertPublicHttpsUrl("https://example.com/a.pdf"),/^https:/); });
test("write approval denial is connector-side", () => { process.env.CLOUDCONVERT_REQUIRE_WRITE_APPROVAL="true"; delete process.env.CLOUDCONVERT_APPROVAL_TOKEN; assert.throws(()=>requireApproval("WRITE"),ApprovalError); });
test("read list uses bounded pagination", async () => { const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp() as any); await router.execute("cloudconvert.job.list",{perPage:25}); assert.match(api.calls[0][1],/per_page=25/); });
test("convert builds a bounded URL-import job", async () => { process.env.CLOUDCONVERT_REQUIRE_WRITE_APPROVAL="false"; const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp() as any); await router.execute("cloudconvert.file.convert",{inputUrl:"https://example.com/a.docx",outputFormat:"pdf"}); assert.equal(api.calls[0][0],"POST"); assert.equal(api.calls[0][2].tasks.convert.operation,"convert"); });
test("advanced job rejects arbitrary commands", async () => { process.env.CLOUDCONVERT_APPROVAL_TOKEN="grant"; const api=new FakeApi(); const router=new ToolRouter(api as any,new FakeMcp() as any); await assert.rejects(()=>router.execute("cloudconvert.job.create",{approvalId:"grant",tasks:{x:{operation:"command"}}}),ValidationError); });
test("destructive operation is disabled by default", async () => { process.env.CLOUDCONVERT_ENABLE_DESTRUCTIVE="false"; process.env.CLOUDCONVERT_APPROVAL_TOKEN="grant"; const router=new ToolRouter(new FakeApi() as any,new FakeMcp() as any); await assert.rejects(()=>router.execute("cloudconvert.webhook.delete",{webhookId:1,approvalId:"grant"}),ApprovalError); });
