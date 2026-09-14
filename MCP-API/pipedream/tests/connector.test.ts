import test from "node:test";
import assert from "node:assert/strict";
import { ToolRouter, tools } from "../src/tools.js";
import { ApprovalError, boundedObject, ValidationError } from "../src/security.js";

class FakePage { constructor(public response:any){} }
class FakePd {
  calls:any[]=[];
  apps={ list:async(r:any)=>{this.calls.push(["apps.list",r]);return new FakePage({data:[{name:"Slack"}],pageInfo:{endCursor:null}})}, retrieve:async(id:string)=>({id}) };
  components={ list:async(r:any)=>new FakePage({data:[r]}), retrieve:async(id:string,r:any)=>({id,...r}) };
  actions={ list:async(r:any)=>new FakePage({data:[r]}), retrieve:async(id:string,r:any)=>({id,...r}), configureProp:async(r:any)=>({options:[r.propName]}), reloadProps:async(r:any)=>({props:r.configuredProps}), run:async(r:any,_o:any)=>{this.calls.push(["actions.run",r,_o]);return {exports:{ok:true}}} };
  accounts={ list:async(r:any)=>{this.calls.push(["accounts.list",r]);return new FakePage({data:[{id:"apn_1"}]})} };
}

test("registers ten stable unique tools",()=>{ assert.equal(tools.length,10); assert.equal(new Set(tools.map(t=>t.name)).size,10); });
test("bounded configuration rejects credential-like data",()=>{ assert.throws(()=>boundedObject({access_token:"secret"},"configuredProps"),ValidationError); });
test("app listing clamps through validator",async()=>{ const pd=new FakePd(); const router=new ToolRouter(pd as any); const out:any=await router.execute("pipedream.app.list",{limit:20}); assert.equal((out as any).data[0].name,"Slack"); assert.equal(pd.calls[0][1].limit,20); });
test("account list always suppresses provider credentials",async()=>{ const pd=new FakePd(); const router=new ToolRouter(pd as any); await router.execute("pipedream.account.list",{externalUserId:"user-1"}); assert.equal(pd.calls[0][1].includeCredentials,false); });
test("action execution requires human approval",async()=>{ delete process.env.PIPEDREAM_APPROVAL_TOKEN; const router=new ToolRouter(new FakePd() as any); await assert.rejects(()=>router.execute("pipedream.action.run",{actionId:"slack-send-message",externalUserId:"u",configuredProps:{text:"hi"},approvalId:"x"}),ApprovalError); });
test("approved action execution disables SDK retries",async()=>{ process.env.PIPEDREAM_APPROVAL_TOKEN="grant"; const pd=new FakePd(); const router=new ToolRouter(pd as any); await router.execute("pipedream.action.run",{actionId:"safe-action",externalUserId:"u",configuredProps:{value:"x"},approvalId:"grant"}); assert.equal(pd.calls[0][2].maxRetries,0); });
test("unknown tool is rejected",async()=>{ const router=new ToolRouter(new FakePd() as any); await assert.rejects(()=>router.execute("pipedream.any.request",{}),ValidationError); });
