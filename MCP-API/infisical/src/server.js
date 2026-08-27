import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './config.js';
import { InfisicalClient } from './client.js';
import { TOOL_DEFINITIONS, withoutApproval } from './tools.js';
import { authorize } from './policy.js';

export function createServer({config=loadConfig(),client=null}={}){
  const api=client||new InfisicalClient(config);
  const server=new Server({name:'infisical-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
  server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOL_DEFINITIONS}));
  server.setRequestHandler(CallToolRequestSchema,async(req)=>{
    const n=req.params.name,a=req.params.arguments||{},p=withoutApproval(a);
    try{
      authorize(config,n,p,a.approval_token);
      let r;
      switch(n){
        case'infisical.auth.status':r=await api.authStatus();break;
        case'infisical.secret.list_metadata':r=await api.list(p,false);break;
        case'infisical.secret.list_imported_metadata':r=await api.list(p,true);break;
        case'infisical.secret.get_metadata':r=await api.get(p);break;
        case'infisical.secret.exists':r=await api.exists(p);break;
        case'infisical.secret.create':r=await api.create(p);break;
        case'infisical.secret.update':
          if(!['secretValue','newSecretName','secretComment','tagIds','metadata'].some(k=>Object.prototype.hasOwnProperty.call(p,k))) throw new Error('secret.update requires at least one field to change');
          r=await api.update(p);break;
        case'infisical.secret.delete':r=await api.delete(p);break;
        default:throw new Error(`Unknown tool: ${n}`);
      }
      return{content:[{type:'text',text:JSON.stringify({untrusted_provider_data:true,secret_values_exposed:false,data:r},null,2)}],structuredContent:{untrusted_provider_data:true,secret_values_exposed:false,data:r}};
    }catch(e){
      const s=e?.status??e?.statusCode??e?.response?.status;
      const type=s===401||s===403?'AUTHORIZATION':s===429?'RATE_LIMIT':s>=500?'PROVIDER_UNAVAILABLE':s>=400?'PROVIDER_REQUEST':'CONNECTOR';
      return{isError:true,content:[{type:'text',text:JSON.stringify({error:{type,status:s,message:e?.message||String(e),retryable:s===429||s>=500}})}]};
    }
  });
  return server;
}
if(import.meta.url===`file://${process.argv[1]}`){const s=createServer();await s.connect(new StdioServerTransport());}
