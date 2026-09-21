import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE='https://api.hellosign.com/v3';
const timeout=Number(process.env.DROPBOX_SIGN_TIMEOUT_MS||15000);
const approved=()=>process.env.DROPBOX_SIGN_APPROVE_WRITES==='true';
class ApiError extends Error { constructor(public status:number, message:string, public retryAfter?:string){super(message)} }
async function api(path:string, init:RequestInit={}){
 const token=process.env.DROPBOX_SIGN_ACCESS_TOKEN, key=process.env.DROPBOX_SIGN_API_KEY;
 if(!token&&!key) throw new Error('Missing Dropbox Sign credential');
 const headers=new Headers(init.headers); headers.set('Accept','application/json');
 headers.set('Authorization', token?`Bearer ${token}`:`Basic ${Buffer.from(key+':').toString('base64')}`);
 const ac=new AbortController(); const t=setTimeout(()=>ac.abort(),timeout);
 try { const r=await fetch(BASE+path,{...init,headers,signal:ac.signal}); if(!r.ok){let m=`Dropbox Sign HTTP ${r.status}`; try{m+=' '+JSON.stringify(await r.json())}catch{} throw new ApiError(r.status,m,r.headers.get('retry-after')||undefined)} const ct=r.headers.get('content-type')||''; return ct.includes('json')?r.json():{contentType:ct,bytes:Buffer.from(await r.arrayBuffer()).toString('base64')}; } finally{clearTimeout(t)}
}
function form(o:Record<string,unknown>){const f=new FormData(); for(const [k,v] of Object.entries(o)) if(v!==undefined&&v!==null) Array.isArray(v)?v.forEach(x=>f.append(k,String(x))):f.append(k,String(v)); return f}
function write(){if(!approved()) throw new Error('Human approval required: set DROPBOX_SIGN_APPROVE_WRITES=true for this execution');}
export function buildServer(){const s=new McpServer({name:'dropbox-sign',version:'1.0.0'});
 s.tool('dropbox_sign.account.get','READ: get authenticated account',{},async()=>({content:[{type:'text',text:JSON.stringify(await api('/account'))}]}));
 s.tool('dropbox_sign.signature_request.list','READ: list signature requests',{page:z.number().int().min(1).optional(),page_size:z.number().int().min(1).max(100).optional(),query:z.string().max(200).optional()},async x=>{const q=new URLSearchParams(); if(x.page)q.set('page',String(x.page));if(x.page_size)q.set('page_size',String(x.page_size));if(x.query)q.set('query',x.query);return {content:[{type:'text',text:JSON.stringify(await api('/signature_request/list?'+q))}]}});
 s.tool('dropbox_sign.signature_request.get','READ: get request metadata',{signature_request_id:z.string().min(1)},async x=>({content:[{type:'text',text:JSON.stringify(await api('/signature_request/'+encodeURIComponent(x.signature_request_id)))}]}));
 s.tool('dropbox_sign.signature_request.files','READ: download signed/current files as base64',{signature_request_id:z.string().min(1),file_type:z.enum(['pdf','zip']).default('pdf')},async x=>({content:[{type:'text',text:JSON.stringify(await api(`/signature_request/files/${encodeURIComponent(x.signature_request_id)}?file_type=${x.file_type}`))}]}));
 s.tool('dropbox_sign.template.list','READ: list templates',{page:z.number().int().min(1).optional(),page_size:z.number().int().min(1).max(100).optional()},async x=>({content:[{type:'text',text:JSON.stringify(await api(`/template/list?page=${x.page||1}&page_size=${x.page_size||20}`))}]}));
 s.tool('dropbox_sign.template.get','READ: get template',{template_id:z.string().min(1)},async x=>({content:[{type:'text',text:JSON.stringify(await api('/template/'+encodeURIComponent(x.template_id)))}]}));
 s.tool('dropbox_sign.signature_request.send_with_template','WRITE/HIGH_RISK: sends an external signature request; approval required',{template_ids:z.array(z.string().min(1)).min(1).max(10),subject:z.string().max(255),message:z.string().max(5000).optional(),signer_email:z.string().email(),signer_name:z.string().min(1).max(255),test_mode:z.boolean().default(true)},async x=>{write();const body=form({'template_ids[]':x.template_ids,subject:x.subject,message:x.message,'signers[0][email_address]':x.signer_email,'signers[0][name]':x.signer_name,test_mode:x.test_mode?1:0});return {content:[{type:'text',text:JSON.stringify(await api('/signature_request/send_with_template',{method:'POST',body}))}]}});
 s.tool('dropbox_sign.signature_request.cancel','DESTRUCTIVE: cancel incomplete request; approval required',{signature_request_id:z.string().min(1)},async x=>{write();return {content:[{type:'text',text:JSON.stringify(await api('/signature_request/cancel/'+encodeURIComponent(x.signature_request_id),{method:'POST'}))}]}});
 s.tool('dropbox_sign.signature_request.remind','WRITE: email reminder to signer; approval required',{signature_request_id:z.string().min(1),email_address:z.string().email()},async x=>{write();return {content:[{type:'text',text:JSON.stringify(await api('/signature_request/remind/'+encodeURIComponent(x.signature_request_id),{method:'POST',body:form({email_address:x.email_address})}))}]}});
 return s; }
if(process.env.NODE_ENV!=='test'){const s=buildServer();await s.connect(new StdioServerTransport());}
