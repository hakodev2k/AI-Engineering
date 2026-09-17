import { z } from 'zod';
import { ApprovalGate,channelId,limit,text,timestamp } from './core.js';
import { SlackClient } from './slack-client.js';
export const schemas={
 list:z.object({types:z.string().default('public_channel,private_channel'),limit:limit.optional(),cursor:z.string().optional()}),
 history:z.object({channel:channelId,limit:limit.optional(),cursor:z.string().optional(),oldest:z.string().optional(),latest:z.string().optional()}),
 thread:z.object({channel:channelId,ts:timestamp,limit:limit.optional(),cursor:z.string().optional()}),
 send:z.object({channel:channelId,text,thread_ts:timestamp.optional(),approval:z.string()}),
 update:z.object({channel:channelId,ts:timestamp,text,approval:z.string()}),
 remove:z.object({channel:channelId,ts:timestamp,approval:z.string()}),
 userGet:z.object({user:z.string().regex(/^[A-Z0-9]{2,32}$/)}),
 userList:z.object({limit:limit.optional(),cursor:z.string().optional()}),
 reactionGet:z.object({channel:channelId,timestamp}),
 reactionAdd:z.object({channel:channelId,timestamp,name:z.string().regex(/^[a-z0-9_+\-]{1,100}$/),approval:z.string()})
};
export function handlers(c:SlackClient,g=new ApprovalGate()) {return {
 'slack.conversation.list':async(i:unknown)=>c.call('conversations.list',schemas.list.parse(i)),
 'slack.conversation.history':async(i:unknown)=>c.call('conversations.history',schemas.history.parse(i)),
 'slack.thread.read':async(i:unknown)=>{const x=schemas.thread.parse(i);return c.call('conversations.replies',{channel:x.channel,ts:x.ts,limit:x.limit,cursor:x.cursor})},
 'slack.message.send':async(i:unknown)=>{const x=schemas.send.parse(i);g.require('WRITE',x.approval);return c.call('chat.postMessage',{channel:x.channel,text:x.text,thread_ts:x.thread_ts})},
 'slack.message.update':async(i:unknown)=>{const x=schemas.update.parse(i);g.require('WRITE',x.approval);return c.call('chat.update',{channel:x.channel,ts:x.ts,text:x.text})},
 'slack.message.delete':async(i:unknown)=>{const x=schemas.remove.parse(i);g.require('DESTRUCTIVE',x.approval);return c.call('chat.delete',{channel:x.channel,ts:x.ts})},
 'slack.user.get':async(i:unknown)=>c.call('users.info',schemas.userGet.parse(i)),
 'slack.user.list':async(i:unknown)=>c.call('users.list',schemas.userList.parse(i)),
 'slack.reaction.get':async(i:unknown)=>c.call('reactions.get',schemas.reactionGet.parse(i)),
 'slack.reaction.add':async(i:unknown)=>{const x=schemas.reactionAdd.parse(i);g.require('WRITE',x.approval);return c.call('reactions.add',{channel:x.channel,timestamp:x.timestamp,name:x.name})}
};}
