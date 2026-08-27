import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from '../auth/config.js';
import { SanityMcpClient } from '../client/upstream-mcp.js';
import { SanityRestFallback } from '../client/sanity-rest.js';
import { SanityTransportRouter } from '../client/router.js';
import { TOOL_DEFINITIONS, stripApproval } from '../tools/definitions.js';
import { authorize } from '../tools/policy.js';

export function createServer({config=loadConfig(),router=null}={}){
  const activeRouter=router||new SanityTransportRouter(config,new SanityMcpClient(config),new SanityRestFallback(config));
  const server=new Server({name:'sanity-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
  server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_DEFINITIONS}));
  server.setRequestHandler(CallToolRequestSchema,async(request)=>{
    const name=request.params.name,args=request.params.arguments||{},payload=stripApproval(args);
    try{
      authorize(config,name,payload,args.approval_token);
      let result;
      switch(name){
        case 'sanity.content.query': result=await activeRouter.query(payload); break;
        case 'sanity.document.get': result=await activeRouter.getDocument(payload); break;
        case 'sanity.schema.get': result=await activeRouter.schemaGet(payload); break;
        case 'sanity.schema.list': result=await activeRouter.schemaList(payload); break;
        case 'sanity.release.list': result=await activeRouter.releaseList(payload); break;
        case 'sanity.document.create_draft': result=await activeRouter.write('create_documents',payload); break;
        case 'sanity.document.patch': result=await activeRouter.write('patch_documents',payload); break;
        case 'sanity.document.publish': result=await activeRouter.write('publish_documents',payload); break;
        case 'sanity.document.unpublish': result=await activeRouter.write('unpublish_documents',payload); break;
        case 'sanity.document.discard_draft': result=await activeRouter.write('discard_drafts',payload); break;
        default: throw new Error(`Unknown tool: ${name}`);
      }
      return {content:[{type:'text',text:JSON.stringify({untrusted_provider_data:true,data:result},null,2)}],structuredContent:{untrusted_provider_data:true,data:result}};
    }catch(error){return {isError:true,content:[{type:'text',text:JSON.stringify({error:normalizeError(error)})}]};}
  });
  return server;
}
function normalizeError(error){
  const status=error?.status??error?.statusCode??error?.response?.status,message=error?.message||String(error);
  if(status===401||status===403)return {type:'AUTHORIZATION',status,message,retryable:false};
  if(status===429)return {type:'RATE_LIMIT',status,message,retryable:true};
  if(status&&status>=500)return {type:'UPSTREAM_UNAVAILABLE',status,message,retryable:true};
  return {type:'CONNECTOR',status,message,retryable:false};
}
if(import.meta.url===`file://${process.argv[1]}`)await createServer().connect(new StdioServerTransport());
