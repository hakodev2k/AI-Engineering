import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { GetStreamClient,loadConfig,requireApproval } from './core.js';

export function buildServer(client:GetStreamClient){
 const s=new McpServer({name:'getstream-connector',version:'1.0.0'}); const out=(v:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(v)}]});
 s.tool('getstream.user.query','Query Stream Chat users. READ.',{filter:z.record(z.unknown()).default({}),limit:z.number().int().min(1).max(100).default(25),offset:z.number().int().min(0).default(0)},async a=>out(await client.queryUsers(a.filter,a.limit,a.offset)));
 s.tool('getstream.channel.query','Query channels using selective Stream filters. READ.',{filter:z.record(z.unknown()),limit:z.number().int().min(1).max(30).default(20),offset:z.number().int().min(0).default(0)},async a=>out(await client.queryChannels(a.filter,a.limit,a.offset)));
 s.tool('getstream.message.search','Search messages in matching channels. READ.',{channelFilter:z.record(z.unknown()),query:z.string().min(1).max(500),limit:z.number().int().min(1).max(100).default(20),offset:z.number().int().min(0).default(0)},async a=>out(await client.search(a.channelFilter,a.query,a.limit,a.offset)));
 s.tool('getstream.message.get','Get one message by ID. READ.',{messageId:z.string().min(1).max(255)},async a=>out(await client.getMessage(a.messageId)));
 s.tool('getstream.message.send','Send an external chat message. WRITE; approval required.',{channelType:z.string().min(1).max(64),channelId:z.string().min(1).max(255),userId:z.string().min(1).max(255),text:z.string().min(1).max(5000),approved:z.literal(true)},async a=>{requireApproval(client.config,a.approved,'WRITE');return out(await client.sendMessage(a.channelType,a.channelId,a.userId,a.text));});
 s.tool('getstream.message.update','Modify an existing message. WRITE; approval required.',{messageId:z.string().min(1).max(255),userId:z.string().min(1).max(255),text:z.string().min(1).max(5000),approved:z.literal(true)},async a=>{requireApproval(client.config,a.approved,'WRITE');return out(await client.updateMessage(a.messageId,a.userId,a.text));});
 s.tool('getstream.message.delete','Delete a message. DESTRUCTIVE; approval required. Hard delete is intentionally unsupported.',{messageId:z.string().min(1).max(255),approved:z.literal(true)},async a=>{requireApproval(client.config,a.approved,'DESTRUCTIVE');return out(await client.deleteMessage(a.messageId,false));});
 s.tool('getstream.user.ban','Ban a user. HIGH_RISK; approval required.',{targetUserId:z.string().min(1).max(255),reason:z.string().max(500).optional(),timeoutMinutes:z.number().int().min(1).max(43200).optional(),approved:z.literal(true)},async a=>{requireApproval(client.config,a.approved,'HIGH_RISK');return out(await client.banUser(a.targetUserId,{reason:a.reason,timeout:a.timeoutMinutes}));});
 return s;
}
if(process.env.NODE_ENV!=='test'){const client=new GetStreamClient(loadConfig());await buildServer(client).connect(new StdioServerTransport());}
