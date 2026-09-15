import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { KitClient } from './client.js';
import { requireApproval, TOOL_POLICY } from './policy.js';

const server=new McpServer({name:'kit-connector',version:'1.0.0'});
const kit=new KitClient();
const approval={approved:z.boolean().optional(),approvalToken:z.string().min(8).max(256).optional()};
const cursor=z.string().max(512).optional();

function register(name:string,description:string,schema:any,map:(x:any)=>Record<string,unknown>) {
  server.tool(name,description,schema,async(input:any)=>{
    const policy=TOOL_POLICY[name]; requireApproval(policy.risk,input);
    const args=map(input); delete (args as any).approved; delete (args as any).approvalToken;
    const result=await kit.call(policy.upstream,args);
    return {content:[{type:'text',text:JSON.stringify(result)}]};
  });
}
register('kit.account.get','READ: Get authenticated Kit account.',{},()=>({}));
register('kit.subscriber.list','READ: List subscribers with cursor pagination.',{after:cursor,perPage:z.number().int().min(1).max(100).optional(),include:z.array(z.enum(['fields','tags','location','attribution','canceled_at'])).max(5).optional()},x=>({after:x.after,per_page:x.perPage,include:x.include}));
register('kit.subscriber.get','READ: Get subscriber by ID.',{subscriberId:z.number().int().positive()},x=>({subscriber_id:x.subscriberId}));
register('kit.subscriber.create','WRITE: Upsert a subscriber by email.',{email:z.string().email().max(320),firstName:z.string().max(255).optional(),...approval},x=>({email_address:x.email,first_name:x.firstName}));
register('kit.subscriber.update','WRITE: Update a subscriber.',{subscriberId:z.number().int().positive(),email:z.string().email().max(320).optional(),firstName:z.string().max(255).optional(),...approval},x=>({subscriber_id:x.subscriberId,email_address:x.email,first_name:x.firstName}));
register('kit.subscriber.tag','WRITE: Apply an existing tag to a subscriber.',{subscriberId:z.number().int().positive(),tagId:z.number().int().positive(),...approval},x=>({subscriber_id:x.subscriberId,tag_id:x.tagId}));
register('kit.subscriber.unsubscribe','DESTRUCTIVE: Unsubscribe a subscriber; explicit approval required.',{subscriberId:z.number().int().positive(),...approval},x=>({subscriber_id:x.subscriberId}));
register('kit.tag.list','READ: List tags.',{after:cursor,perPage:z.number().int().min(1).max(100).optional()},x=>({after:x.after,per_page:x.perPage}));
register('kit.sequence.list','READ: List email sequences.',{after:cursor,perPage:z.number().int().min(1).max(100).optional(),includeStats:z.boolean().optional()},x=>({after:x.after,per_page:x.perPage,include:x.includeStats?['stats']:undefined}));
register('kit.broadcast.list','READ: List broadcasts.',{after:cursor,perPage:z.number().int().min(1).max(100).optional(),includeContent:z.boolean().optional()},x=>({after:x.after,per_page:x.perPage,include:x.includeContent?['content']:undefined}));
register('kit.broadcast.get','READ: Get broadcast by ID.',{broadcastId:z.number().int().positive()},x=>({broadcast_id:x.broadcastId}));
register('kit.broadcast.stats','READ: Get broadcast performance statistics.',{broadcastId:z.number().int().positive()},x=>({broadcast_id:x.broadcastId}));
register('kit.broadcast.create','WRITE: Create a draft broadcast. Sending is intentionally not exposed.',{subject:z.string().min(1).max(998),content:z.string().min(1).max(200000),description:z.string().max(500).optional(),...approval},x=>({subject:x.subject,content:x.content,description:x.description}));
register('kit.broadcast.update','WRITE: Update an existing draft broadcast.',{broadcastId:z.number().int().positive(),subject:z.string().min(1).max(998).optional(),content:z.string().min(1).max(200000).optional(),...approval},x=>({broadcast_id:x.broadcastId,subject:x.subject,content:x.content}));
register('kit.webhook.list','READ: List configured webhooks.',{},()=>({}));

const transport=new StdioServerTransport();
await server.connect(transport);
process.on('SIGINT',async()=>{await kit.close();process.exit(0)});
process.on('SIGTERM',async()=>{await kit.close();process.exit(0)});
