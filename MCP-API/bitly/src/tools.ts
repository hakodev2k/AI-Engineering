import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {z} from 'zod';
import {BitlyClient,bitlinkPath} from './client.js';
import {authorize,type Risk,type Policy} from './policy.js';

const guid=z.string().regex(/^[A-Za-z0-9_-]{3,128}$/);
const bitlink=z.string().regex(/^[A-Za-z0-9.-]+\/[A-Za-z0-9_-]+$/).max(255);
const unit=z.enum(['minute','hour','day','week','month']);
const approved=z.boolean().optional();
const page={size:z.number().int().min(1).max(100).optional(),search_after:z.string().max(1024).optional()};
const httpsUrl=z.string().url().max(4096).refine(v=>new URL(v).protocol==='https:','Only HTTPS destinations are allowed');

type Shape=Record<string,z.ZodTypeAny>;
export function registerTools(server:McpServer,api:BitlyClient,policy:Policy){
  const out=(result:unknown)=>({content:[{type:'text' as const,text:JSON.stringify({provider:'bitly',untrusted_data:true,result},null,2)}]});
  const reg=(name:string,purpose:string,risk:Risk,inputSchema:Shape,handler:(a:any)=>Promise<unknown>)=>server.registerTool(name,{description:`${purpose} Permission=${risk}. ${risk==='READ'?'No approval required.':risk==='WRITE'?'Human approval may be required by policy.':'Explicit human approval required.'}`,inputSchema},async(a:any)=>{try{authorize(risk,a.approved,policy);return out(await handler(a))}catch(e){return{isError:true,content:[{type:'text' as const,text:JSON.stringify({provider:'bitly',error:e instanceof Error?e.message:'Unknown error'})}]}}});

  reg('bitly.user.get','Get the authenticated Bitly user.','READ',{},()=>api.request('GET','/user'));
  reg('bitly.user.platform_limits','Get platform API limits for the authenticated user.','READ',{},()=>api.request('GET','/user/platform_limits'));
  reg('bitly.organization.list','List organizations visible to the token.','READ',{include_all:z.boolean().optional()},a=>api.request('GET','/organizations',undefined,{include_all:a.include_all}));
  reg('bitly.group.list','List Bitly groups, optionally within an organization.','READ',{organization_guid:guid.optional()},a=>api.request('GET','/groups',undefined,a));
  reg('bitly.group.get','Get group metadata.','READ',{group_guid:guid},a=>api.request('GET',`/groups/${a.group_guid}`));
  reg('bitly.group.preferences','Get group preferences.','READ',{group_guid:guid},a=>api.request('GET',`/groups/${a.group_guid}/preferences`));
  reg('bitly.group.tags','List tags used by a group.','READ',{group_guid:guid},a=>api.request('GET',`/groups/${a.group_guid}/tags`));
  reg('bitly.link.list','List short links owned by a group using cursor pagination.','READ',{group_guid:guid,...page,query:z.string().max(512).optional(),archived:z.boolean().optional()},a=>{const{group_guid,...q}=a;return api.request('GET',`/groups/${group_guid}/bitlinks`,undefined,q)});
  reg('bitly.link.get','Get details for a Bitlink.','READ',{bitlink_id:bitlink},a=>api.request('GET',bitlinkPath(a.bitlink_id)));
  reg('bitly.link.destination','Expand a Bitlink to its destination.','READ',{bitlink_id:bitlink},a=>api.request('POST','/expand',{bitlink_id:a.bitlink_id}));
  reg('bitly.link.clicks','Get time-series click counts for a Bitlink.','READ',{bitlink_id:bitlink,unit:unit.optional(),units:z.number().int().min(-1).max(1000).optional(),unit_reference:z.string().datetime({offset:true}).optional()},a=>{const{bitlink_id,...q}=a;return api.request('GET',`${bitlinkPath(bitlink_id)}/clicks`,undefined,q)});
  reg('bitly.link.clicks_summary','Get rolled-up click count for a Bitlink.','READ',{bitlink_id:bitlink,unit:unit.optional(),units:z.number().int().min(-1).max(1000).optional(),unit_reference:z.string().datetime({offset:true}).optional()},a=>{const{bitlink_id,...q}=a;return api.request('GET',`${bitlinkPath(bitlink_id)}/clicks/summary`,undefined,q)});
  reg('bitly.group.clicks','Get group click analytics.','READ',{group_guid:guid,unit:unit.optional(),units:z.number().int().min(-1).max(1000).optional(),unit_reference:z.string().datetime({offset:true}).optional()},a=>{const{group_guid,...q}=a;return api.request('GET',`/groups/${group_guid}/clicks`,undefined,q)});
  reg('bitly.group.devices','Get group click-device analytics.','READ',{group_guid:guid,unit:unit.optional(),units:z.number().int().min(-1).max(1000).optional(),unit_reference:z.string().datetime({offset:true}).optional()},a=>{const{group_guid,...q}=a;return api.request('GET',`/groups/${group_guid}/devices`,undefined,q)});
  reg('bitly.link.create','Create a short link.','WRITE',{long_url:httpsUrl,domain:z.string().regex(/^[A-Za-z0-9.-]+$/).optional(),group_guid:guid.optional(),approved},a=>{const{approved:_,...body}=a;return api.request('POST','/shorten',body)});
  reg('bitly.link.update','Update title, archive state, tags, or destination of a Bitlink. Redirect changes are security-sensitive.','HIGH_RISK',{bitlink_id:bitlink,long_url:httpsUrl.optional(),title:z.string().max(1024).optional(),archived:z.boolean().optional(),tags:z.array(z.string().min(1).max(100)).max(100).optional(),approved},a=>{const{bitlink_id,approved:_,...body}=a;if(Object.keys(body).length===0)throw new Error('At least one mutable field is required');return api.request('PATCH',bitlinkPath(bitlink_id),body)});
  reg('bitly.link.delete','Delete an eligible unedited-hash Bitlink.','DESTRUCTIVE',{bitlink_id:bitlink,confirm_bitlink_id:bitlink,approved},a=>{if(a.confirm_bitlink_id!==a.bitlink_id)throw new Error('confirm_bitlink_id must exactly match bitlink_id');return api.request('DELETE',bitlinkPath(a.bitlink_id))});
}
