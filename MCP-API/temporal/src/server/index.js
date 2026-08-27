import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "../auth/config.js";
import { TemporalConnectorClient } from "../client/temporal-client.js";
import { TOOL_DEFINITIONS, payloadWithoutApproval } from "../tools/definitions.js";
import { authorize } from "../tools/policy.js";

export function createServer({config=loadConfig(),client=null}={}){
 const api=client||new TemporalConnectorClient(config); const server=new Server({name:"temporal-safe-connector",version:"1.0.0"},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_DEFINITIONS}));
 server.setRequestHandler(CallToolRequestSchema,async(request)=>{const name=request.params.name,args=request.params.arguments||{},payload=payloadWithoutApproval(args); try{authorize(config,name,payload,args.approval_token); let result; switch(name){
 case "temporal.workflow.list":result=await api.listWorkflows(payload);break; case "temporal.workflow.describe":result=await api.describeWorkflow(payload);break; case "temporal.workflow.start":result=await api.startWorkflow(payload);break; case "temporal.workflow.signal":result=await api.signalWorkflow(payload);break; case "temporal.workflow.query":result=await api.queryWorkflow(payload);break; case "temporal.workflow.cancel":result=await api.cancelWorkflow(payload);break; case "temporal.workflow.terminate":result=await api.terminateWorkflow(payload);break; case "temporal.schedule.list":result=await api.listSchedules(payload);break; case "temporal.schedule.describe":result=await api.describeSchedule(payload);break; case "temporal.schedule.pause":result=await api.pauseSchedule(payload);break; case "temporal.schedule.unpause":result=await api.unpauseSchedule(payload);break; case "temporal.schedule.delete":result=await api.deleteSchedule(payload);break; default:throw new Error(`Unknown tool: ${name}`);} return {content:[{type:"text",text:JSON.stringify({untrusted_provider_data:true,data:result},null,2)}],structuredContent:{untrusted_provider_data:true,data:result}};}catch(error){return {isError:true,content:[{type:"text",text:JSON.stringify({error:normalizeError(error)})}]};}});
 return server;
}
function normalizeError(error){const message=error?.message||"Temporal connector error",name=error?.name||"Error",lower=message.toLowerCase(); if(lower.includes("permission")||lower.includes("unauth")||lower.includes("api key"))return{type:"AUTHORIZATION",name,message,retryable:false}; if(lower.includes("not found"))return{type:"NOT_FOUND",name,message,retryable:false}; if(lower.includes("timeout"))return{type:"TIMEOUT",name,message,retryable:true}; if(lower.includes("resource exhausted")||lower.includes("rate"))return{type:"RATE_LIMIT",name,message,retryable:true}; return{type:"TEMPORAL",name,message,retryable:false};}
if(import.meta.url===`file://${process.argv[1]}`){const server=createServer(); await server.connect(new StdioServerTransport());}
