import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {CallToolRequestSchema,ListToolsRequestSchema} from '@modelcontextprotocol/sdk/types.js';
import {assertAllowed,sanitize} from './security.js';

const upstream=process.env.ALCHEMY_MCP_URL??'https://mcp.alchemy.com/mcp';
const tools=[
 ['alchemy.chain.list','list_chains',{},'List supported chains'],
 ['alchemy.app.list','list_apps',{},'List Alchemy apps'],
 ['alchemy.app.get','get_app',{appId:{type:'string'}},'Get app metadata'],
 ['alchemy.app.select','select_app',{appId:{type:'string'}},'Select app for subsequent reads'],
 ['alchemy.wallet.balance','eth_getBalance',{address:{type:'string',pattern:'^0x[a-fA-F0-9]{40}$'},block:{type:'string',default:'latest'}},'Read native balance'],
 ['alchemy.transaction.get','eth_getTransactionByHash',{hash:{type:'string',pattern:'^0x[a-fA-F0-9]{64}$'}},'Read transaction'],
 ['alchemy.token.metadata','alchemy_getTokenMetadata',{contractAddress:{type:'string',pattern:'^0x[a-fA-F0-9]{40}$'}},'Read token metadata'],
 ['alchemy.transfer.list','alchemy_getAssetTransfers',{fromBlock:{type:'string'},toBlock:{type:'string'},fromAddress:{type:'string'},toAddress:{type:'string'},maxCount:{type:'string'}},'List asset transfers']
] as const;

async function callUpstream(name:string,args:unknown){assertAllowed(name);const r=await fetch(upstream,{method:'POST',headers:{'content-type':'application/json','accept':'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:crypto.randomUUID(),method:'tools/call',params:{name,arguments:args}}),signal:AbortSignal.timeout(20000)});if(r.status===429)throw new Error(`Alchemy rate limited; retry-after=${r.headers.get('retry-after')??'unknown'}`);if(!r.ok)throw new Error(`Alchemy MCP HTTP ${r.status}`);const text=await r.text();const payload=text.startsWith('data:')?JSON.parse(text.split('\n').find(x=>x.startsWith('data:'))!.slice(5)):JSON.parse(text);if(payload.error)throw new Error(`Alchemy MCP error: ${payload.error.message}`);return sanitize(payload.result);}

const server=new Server({name:'alchemy-safe-connector',version:'1.0.0'},{capabilities:{tools:{}}});
server.setRequestHandler(ListToolsRequestSchema,async()=>({tools:tools.map(([name,,props,description])=>({name,description,inputSchema:{type:'object',properties:props,additionalProperties:false}}))}));
server.setRequestHandler(CallToolRequestSchema,async req=>{const def=tools.find(x=>x[0]===req.params.name);if(!def)throw new Error('Unknown tool');const result=await callUpstream(def[1],req.params.arguments??{});return {content:[{type:'text',text:JSON.stringify({source:'untrusted-provider-data',data:result})}]};});
await server.connect(new StdioServerTransport());
