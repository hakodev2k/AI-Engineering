import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js"; import { ChargebeeApiError,ChargebeeClient } from "./client.js"; import { assertAllowed } from "./policy.js"; import { TOOLS,TOOL_MAP } from "./tools.js";
const config=loadConfig(); const client=new ChargebeeClient(config); const enc=(v:unknown)=>encodeURIComponent(String(v)); const page=(a:Record<string,unknown>)=>({limit:a.limit,offset:a.offset});
export async function dispatch(name:string,a:Record<string,unknown>){
 switch(name){
  case "chargebee.customer.list":return client.request("GET","/customers",page(a));
  case "chargebee.customer.get":return client.request("GET",`/customers/${enc(a.customerId)}`);
  case "chargebee.customer.create":return client.request("POST","/customers",{id:a.customerId,email:a.email,first_name:a.firstName,last_name:a.lastName,company:a.company});
  case "chargebee.customer.update":return client.request("POST",`/customers/${enc(a.customerId)}`,{email:a.email,first_name:a.firstName,last_name:a.lastName,company:a.company});
  case "chargebee.subscription.list":return client.request("GET","/subscriptions",page(a));
  case "chargebee.subscription.get":return client.request("GET",`/subscriptions/${enc(a.subscriptionId)}`);
  case "chargebee.subscription.cancel":return client.request("POST",`/subscriptions/${enc(a.subscriptionId)}/cancel`,{end_of_term:a.endOfTerm});
  case "chargebee.subscription.pause":return client.request("POST",`/subscriptions/${enc(a.subscriptionId)}/pause`,{pause_option:a.pauseOption});
  case "chargebee.subscription.resume":return client.request("POST",`/subscriptions/${enc(a.subscriptionId)}/resume`,{resume_option:a.resumeOption});
  case "chargebee.invoice.list":return client.request("GET","/invoices",page(a));
  case "chargebee.invoice.get":return client.request("GET",`/invoices/${enc(a.invoiceId)}`);
  case "chargebee.credit_note.list":return client.request("GET","/credit_notes",page(a));
  case "chargebee.transaction.list":return client.request("GET","/transactions",page(a));
  case "chargebee.item_price.list":return client.request("GET","/item_prices",page(a));
  default:throw new Error("Unknown Chargebee tool.");
 }
}
const output=(v:unknown)=>({content:[{type:"text" as const,text:JSON.stringify({source:"untrusted_provider_data",data:v},null,2)}]});
export const server=new Server({name:"chargebee-connector",version:"1.0.0"},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOLS.map(t=>({name:t.name,description:`${t.description} Risk=${t.risk}.`,inputSchema:t.inputSchema as any}))}));
server.setRequestHandler(CallToolRequestSchema,async request=>{const tool=TOOL_MAP.get(request.params.name);if(!tool)throw new Error("Tool is not exposed by this connector.");const args=tool.schema.parse(request.params.arguments??{}) as Record<string,unknown>;assertAllowed(tool.risk,tool.name,args,config);try{return output(await dispatch(tool.name,args));}catch(e){if(e instanceof ChargebeeApiError){if(e.status===401)throw new Error("Chargebee authentication failed.");if(e.status===403)throw new Error("Chargebee denied the operation; verify API key permissions.");if(e.status===404)throw new Error("Chargebee resource was not found.");if(e.status===422)throw new Error(`Chargebee validation failed: ${e.message}`);if(e.status===429)throw new Error(`Chargebee rate limit reached.${e.retryAfter?` Retry after ${e.retryAfter}.`:""}`);}throw e;}});
if(import.meta.url===`file://${process.argv[1]}`)server.connect(new StdioServerTransport()).catch(e=>{console.error(e instanceof Error?e.message:e);process.exit(1);});
