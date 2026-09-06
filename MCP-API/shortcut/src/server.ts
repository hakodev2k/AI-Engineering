import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { ShortcutApiError, ShortcutClient } from "./client.js";
import { assertAllowed } from "./policy.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const result=(value:unknown)=>({content:[{type:"text" as const,text:JSON.stringify({data:value,security:{providerContentIsUntrusted:true}},null,2)}]});
const clean=(o:Record<string,unknown>)=>Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined));

export function createServer(config=loadConfig(), client=new ShortcutClient(config)){
 const server=new Server({name:"shortcut-connector",version:"1.0.0"},{capabilities:{tools:{}}});
 server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:TOOLS.map(t=>({name:t.name,description:`${t.description} Permission=${t.risk}; approval=${t.risk==="WRITE"?"configurable":"not required"}.`,inputSchema:t.inputSchema as any}))}));
 server.setRequestHandler(CallToolRequestSchema,async request=>{
   const tool=TOOL_MAP.get(request.params.name); if(!tool) throw new Error("Tool is not exposed by this connector.");
   const args=tool.schema.parse(request.params.arguments??{}) as Record<string,unknown>;
   assertAllowed(tool.risk,tool.name,args,config);
   try{
     switch(tool.name){
       case "shortcut.story.search": return result(await client.request("GET","/search/stories",undefined,clean({query:args.query,page_size:args.pageSize,detail:args.detail,next:args.next}) as Record<string,string|number|boolean|undefined>));
       case "shortcut.story.get": return result(await client.request("GET",`/stories/${args.storyId}`));
       case "shortcut.story.create": return result(await client.request("POST","/stories",clean({name:args.name,story_type:args.storyType,workflow_state_id:args.workflowStateId,description:args.description,epic_id:args.epicId,iteration_id:args.iterationId,group_id:args.groupId,owner_ids:args.ownerIds,estimate:args.estimate})));
       case "shortcut.story.update": return result(await client.request("PUT",`/stories/${args.storyId}`,clean({name:args.name,description:args.description,workflow_state_id:args.workflowStateId,story_type:args.storyType,epic_id:args.epicId,iteration_id:args.iterationId,estimate:args.estimate})));
       case "shortcut.story.comment.create": return result(await client.request("POST",`/stories/${args.storyId}/comments`,{text:args.text}));
       case "shortcut.epic.list": return result(await client.request("GET","/epics"));
       case "shortcut.epic.get": return result(await client.request("GET",`/epics/${args.epicId}`));
       case "shortcut.epic.create": return result(await client.request("POST","/epics",clean({name:args.name,description:args.description,milestone_id:args.objectiveId,group_id:args.groupId})));
       case "shortcut.iteration.list": return result(await client.request("GET","/iterations"));
       case "shortcut.objective.list": return result(await client.request("GET","/objectives"));
       case "shortcut.team.list": return result(await client.request("GET","/groups"));
       case "shortcut.workflow.list": return result(await client.request("GET","/workflows"));
       default: throw new Error("No handler for tool.");
     }
   }catch(error){
     if(error instanceof ShortcutApiError){
       if(error.status===401) throw new Error("Shortcut authentication failed. Verify SHORTCUT_API_TOKEN.");
       if(error.status===403) throw new Error("Shortcut denied this operation for the current member/workspace permissions.");
       if(error.status===404) throw new Error("Shortcut resource was not found.");
       if(error.status===422||error.status===400) throw new Error(`Shortcut validation failed: ${error.message}`);
       if(error.status===429) throw new Error(`Shortcut rate limit reached.${error.retryAfter?` Retry after ${error.retryAfter} seconds.`:""}`);
       throw new Error(`Shortcut API error ${error.status}: ${error.message}`);
     }
     if(error instanceof Error&&error.name==="AbortError") throw new Error("Shortcut request timed out.");
     throw error;
   }
 });
 return server;
}

if(import.meta.url===`file://${process.argv[1]}`){
 createServer().connect(new StdioServerTransport()).catch(error=>{console.error(error instanceof Error?error.message:error);process.exit(1);});
}
