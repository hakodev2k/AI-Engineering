import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';

export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export const TOOL_RISK: Record<string,Risk> = {
  'uploadthing.file.list':'READ','uploadthing.usage.get':'READ','uploadthing.file.signed_url':'READ',
  'uploadthing.file.upload_url':'WRITE','uploadthing.file.rename':'WRITE',
  'uploadthing.file.acl_update':'HIGH_RISK','uploadthing.file.delete':'DESTRUCTIVE'
};
export function approved(tool:string, env:NodeJS.ProcessEnv=process.env){if(TOOL_RISK[tool]==='READ')return true;return new Set((env.UPLOADTHING_APPROVED_TOOLS??'').split(',').map(x=>x.trim()).filter(Boolean)).has(tool);}
export function requireApproval(tool:string,env:NodeJS.ProcessEnv=process.env){if(!approved(tool,env))throw new Error(`APPROVAL_REQUIRED: ${tool}`);}
export function requireToken(env:NodeJS.ProcessEnv=process.env){const token=env.UPLOADTHING_TOKEN?.trim();if(!token)throw new Error('AUTH_CONFIGURATION_ERROR: UPLOADTHING_TOKEN is required');return token;}
function text(value:unknown){return {content:[{type:'text' as const,text:JSON.stringify(value,null,2)}]};}
function normalizeError(e:unknown){const m=e instanceof Error?e.message:String(e);return new Error(m.replace(/(sk_|utapi_|UPLOADTHING_TOKEN=)[^\s,]+/gi,'$1[REDACTED]'));}

export function createServer(env:NodeJS.ProcessEnv=process.env,client?:UTApi){
  const api=client??new UTApi({token:requireToken(env)}); const server=new McpServer({name:'uploadthing-connector',version:'1.0.0'});
  const run=async<T>(fn:()=>Promise<T>)=>{try{return text(await fn());}catch(e){throw normalizeError(e);}};
  server.tool('uploadthing.file.list','List files for administrative/debugging use. READ.',{limit:z.number().int().min(1).max(500).default(100),offset:z.number().int().min(0).default(0)},({limit,offset})=>run(()=>api.listFiles({limit,offset})));
  server.tool('uploadthing.usage.get','Get application storage usage. READ.',{},()=>run(()=>api.getUsageInfo()));
  server.tool('uploadthing.file.signed_url','Generate a short-lived URL for a private file. READ; maximum 7 days.',{fileKey:z.string().min(1).max(1024),expiresInSeconds:z.number().int().min(1).max(604800).default(3600)},({fileKey,expiresInSeconds})=>run(()=>api.generateSignedURL(fileKey,{expiresIn:expiresInSeconds})));
  server.tool('uploadthing.file.upload_url','Import one remote HTTPS resource. WRITE; approval required.',{url:z.string().url().refine(v=>v.startsWith('https://'),'HTTPS only'),name:z.string().min(1).max(255).refine(v=>!/[\\/]/.test(v),'filename only').optional(),customId:z.string().min(1).max(255).optional(),acl:z.enum(['public-read','private']).optional()},async({url,name,customId,acl})=>{requireApproval('uploadthing.file.upload_url',env);const source=name||customId?{url,name,customId}:url;return run(()=>api.uploadFilesFromUrl(source,{metadata:{source:'mcp'},contentDisposition:'inline',...(acl?{acl}:{})}));});
  server.tool('uploadthing.file.rename','Rename a file. WRITE; approval required.',{fileKey:z.string().min(1).max(1024),newName:z.string().min(1).max(255).refine(v=>!/[\\/]/.test(v),'filename only')},async({fileKey,newName})=>{requireApproval('uploadthing.file.rename',env);return run(()=>api.renameFiles({fileKey,newName}));});
  server.tool('uploadthing.file.acl_update','Change a file ACL. HIGH_RISK; explicit approval required.',{fileKey:z.string().min(1).max(1024),acl:z.enum(['public-read','private'])},async({fileKey,acl})=>{requireApproval('uploadthing.file.acl_update',env);return run(()=>api.updateACL(fileKey,acl));});
  server.tool('uploadthing.file.delete','Permanently delete files. DESTRUCTIVE; explicit approval required.',{fileKeys:z.array(z.string().min(1).max(1024)).min(1).max(50)},async({fileKeys})=>{requireApproval('uploadthing.file.delete',env);return run(()=>api.deleteFiles(fileKeys));});
  return server;
}
if(process.env.NODE_ENV!=='test'){const server=createServer();await server.connect(new StdioServerTransport());}
