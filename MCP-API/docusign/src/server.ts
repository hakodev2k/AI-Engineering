import { Server } from "@modelcontextprotocol/sdk/server/index.js";import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";import { CallToolRequestSchema,ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import {loadConfig} from "./config.js";import {DocusignApiError,DocusignClient} from "./client.js";import {assertAllowed} from "./policy.js";import {TOOLS,TOOL_MAP} from "./tools.js";
const c=loadConfig(),api=new DocusignClient(c),account=encodeURIComponent(c.accountId),base=`/v2.1/accounts/${account}`;
const out=(v:unknown)=>({content:[{type:"text" as const,text:JSON.stringify(v,null,2)}]});
async function dispatch(n:string,a:Record<string,unknown>){switch(n){
 case"docusign.user.info.get":return api.userInfo();
 case"docusign.envelope.list":return api.request("GET",base+"/envelopes",undefined,{from_date:a.fromDate?String(a.fromDate):undefined,status:a.status?String(a.status):undefined,count:a.count?String(a.count):undefined,start_position:a.startPosition!==undefined?String(a.startPosition):undefined});
 case"docusign.envelope.get":return api.request("GET",`${base}/envelopes/${encodeURIComponent(String(a.envelopeId))}`);
 case"docusign.envelope.recipients.list":return api.request("GET",`${base}/envelopes/${encodeURIComponent(String(a.envelopeId))}/recipients`);
 case"docusign.envelope.documents.list":return api.request("GET",`${base}/envelopes/${encodeURIComponent(String(a.envelopeId))}/documents`);
 case"docusign.template.list":return api.request("GET",base+"/templates",undefined,{count:a.count?String(a.count):undefined,start_position:a.startPosition!==undefined?String(a.startPosition):undefined,search_text:a.searchText?String(a.searchText):undefined});
 case"docusign.template.get":return api.request("GET",`${base}/templates/${encodeURIComponent(String(a.templateId))}`);
 case"docusign.template.recipients.list":return api.request("GET",`${base}/templates/${encodeURIComponent(String(a.templateId))}/recipients`);
 case"docusign.envelope.create_draft":return api.request("POST",base+"/envelopes",{emailSubject:a.emailSubject,documents:a.documents,recipients:{signers:a.signers},status:"created"});
 case"docusign.envelope.create_from_template_draft":return api.request("POST",base+"/envelopes",{templateId:a.templateId,emailSubject:a.emailSubject,templateRoles:a.templateRoles,status:"created"});
 case"docusign.envelope.send":return api.request("PUT",`${base}/envelopes/${encodeURIComponent(String(a.envelopeId))}`,{status:"sent"});
 case"docusign.envelope.void":return api.request("PUT",`${base}/envelopes/${encodeURIComponent(String(a.envelopeId))}`,{status:"voided",voidedReason:a.voidedReason});
 default:throw new Error("Unknown Docusign tool");}}
export const server=new Server({name:"docusign-connector",version:"1.0.0"},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOLS.map(t=>({name:t.name,description:`${t.description} Risk=${t.risk}.`,inputSchema:t.inputSchema as any}))}));
server.setRequestHandler(CallToolRequestSchema,async r=>{const t=TOOL_MAP.get(r.params.name);if(!t)throw new Error("Tool is not exposed.");const a=t.schema.parse(r.params.arguments??{}) as Record<string,unknown>;assertAllowed(t.risk,t.name,a,c);
 try{return out(await dispatch(t.name,a));}catch(e){if(e instanceof DocusignApiError){if(e.status===401)throw new Error("Docusign authentication failed; re-authorize OAuth.");if(e.status===403)throw new Error("Docusign denied the operation; verify account/scopes.");if(e.status===429)throw new Error(`Docusign rate limit reached.${e.retryAfter?` Retry after ${e.retryAfter}.`:""}`);}throw e;}});
if(import.meta.url===`file://${process.argv[1]}`)server.connect(new StdioServerTransport()).catch(e=>{console.error(e);process.exit(1);});
