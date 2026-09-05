import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { KnockClient, KnockApiError } from "./client.js";
import { assertAllowed } from "./policy.js";
import { byName, tools } from "./tools.js";
const esc = encodeURIComponent;
const textResult = value => ({content:[{type:"text",text:JSON.stringify(value,null,2)}]});
export function createServer(client) {
  const cfg=loadConfig(); const api=client||new KnockClient(cfg);
  const server=new Server({name:"knock-connector",version:"1.0.0"},{capabilities:{tools:{}}});
  server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:tools.map(t=>({name:t.name,description:`${t.description} Risk=${t.risk}.`,inputSchema:t.inputSchema}))}));
  server.setRequestHandler(CallToolRequestSchema,async(req)=>{
    const def=byName.get(req.params.name); if(!def) throw new Error("Unknown Knock tool.");
    const a=def.validate(req.params.arguments||{}); assertAllowed(def.risk,a.approval,cfg.requireWriteApproval);
    try {
      let r;
      switch(def.name){
        case "knock.user.get":r=await api.request({path:`/users/${esc(a.user_id)}`});break;
        case "knock.user.list":r=await api.request({path:"/users",query:{page_size:a.page_size,after:a.after,before:a.before}});break;
        case "knock.user.identify":{const {user_id,approval:_,properties,...known}=a;r=await api.request({method:"PUT",path:`/users/${esc(user_id)}`,body:{...(properties||{}),...known}});break;}
        case "knock.user.preferences.list":r=await api.request({path:`/users/${esc(a.user_id)}/preferences`});break;
        case "knock.user.preferences.get":r=await api.request({path:`/users/${esc(a.user_id)}/preferences/${esc(a.preference_set_id)}`,query:{tenant:a.tenant}});break;
        case "knock.user.preferences.set":r=await api.request({method:"PUT",path:`/users/${esc(a.user_id)}/preferences/${esc(a.preference_set_id)}`,query:{tenant:a.tenant},body:a.preferences});break;
        case "knock.user.messages.list":r=await api.request({path:`/users/${esc(a.user_id)}/messages`,query:{page_size:a.page_size,after:a.after,before:a.before}});break;
        case "knock.user.subscriptions.list":r=await api.request({path:`/users/${esc(a.user_id)}/subscriptions`,query:{page_size:a.page_size,after:a.after,before:a.before}});break;
        case "knock.workflow.trigger":r=await api.request({method:"POST",path:`/workflows/${esc(a.workflow_key)}/trigger`,body:{recipients:a.recipients,data:a.data,actor:a.actor,tenant:a.tenant,cancellation_key:a.cancellation_key,settings:{sandbox_mode:a.sandbox_mode,skip_delay:a.skip_delay}},idempotencyKey:a.idempotency_key,retrySafe:true});break;
        case "knock.workflow.cancel":r=await api.request({method:"POST",path:`/workflows/${esc(a.workflow_key)}/cancel`,body:{cancellation_key:a.cancellation_key,recipients:a.recipients}});break;
        default:throw new Error("Tool is not implemented.");
      }
      return textResult(r);
    } catch(e) {
      if(e instanceof KnockApiError){if(e.status===401)throw new Error("Knock authentication failed. Verify KNOCK_API_KEY.");if(e.status===403)throw new Error("Knock denied the request. Verify environment access.");if(e.status===429)throw new Error(`Knock rate limit reached.${e.retryAfter?` Retry-After=${e.retryAfter}.`:""}`);} throw e;
    }
  });
  return server;
}
async function main(){await createServer().connect(new StdioServerTransport());}
if(import.meta.url===`file://${process.argv[1]}`)main().catch(e=>{console.error(e instanceof Error?e.message:e);process.exit(1);});
