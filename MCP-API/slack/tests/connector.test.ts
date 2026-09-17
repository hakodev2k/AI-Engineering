import { describe,expect,it } from 'vitest';
import { ApprovalGate,ConnectorError } from '../src/core.js';
import { SlackClient } from '../src/slack-client.js';
import { handlers,schemas } from '../src/tools.js';
const response=(body:any,status=200,headers:Record<string,string>={})=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}});
describe('Slack connector',()=>{
 it('validates channel IDs',()=>expect(()=>schemas.history.parse({channel:'../../bad'})).toThrow());
 it('denies writes without approval',async()=>{const c=new SlackClient({token:'x',fetchImpl:async()=>response({ok:true})});const h=handlers(c,new ApprovalGate('secret'));await expect(h['slack.message.send']({channel:'C123',text:'hi',approval:'bad'})).rejects.toMatchObject({code:'APPROVAL_REQUIRED'});});
 it('executes read and preserves pagination',async()=>{let body:any;const c=new SlackClient({token:'x',fetchImpl:async(_u,o)=>{body=JSON.parse(String(o?.body));return response({ok:true,messages:[],response_metadata:{next_cursor:'n'}})}});const h=handlers(c,new ApprovalGate('secret'));const r:any=await h['slack.conversation.history']({channel:'C123',limit:10,cursor:'c'});expect(body.cursor).toBe('c');expect(r.response_metadata.next_cursor).toBe('n');});
 it('executes approved write',async()=>{const c=new SlackClient({token:'x',fetchImpl:async()=>response({ok:true,ts:'1.000001'})});const h=handlers(c,new ApprovalGate('secret'));const r:any=await h['slack.message.send']({channel:'C123',text:'hi',approval:'secret'});expect(r.ok).toBe(true);});
 it('maps invalid credentials without retry',async()=>{let n=0;const c=new SlackClient({token:'x',maxRetries:2,fetchImpl:async()=>{n++;return response({ok:false,error:'invalid_auth'})}});await expect(c.call('users.list')).rejects.toMatchObject({code:'invalid_auth'});expect(n).toBe(1);});
 it('maps rate limits after bounded retries',async()=>{let n=0;const c=new SlackClient({token:'x',maxRetries:0,fetchImpl:async()=>{n++;return response({ok:false},429,{'retry-after':'7'})}});await expect(c.call('users.list')).rejects.toEqual(expect.objectContaining({code:'HTTP_429',retryAfter:7}));expect(n).toBe(1);});
 it('requires credentials',()=>{const a=process.env.SLACK_BOT_TOKEN,b=process.env.SLACK_USER_TOKEN;delete process.env.SLACK_BOT_TOKEN;delete process.env.SLACK_USER_TOKEN;expect(()=>new SlackClient()).toThrow(ConnectorError);if(a)process.env.SLACK_BOT_TOKEN=a;if(b)process.env.SLACK_USER_TOKEN=b;});
});
