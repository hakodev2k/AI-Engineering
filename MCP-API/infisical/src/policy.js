import crypto from 'node:crypto';
import { approvalDigest } from './config.js';
export const TOOL_POLICY = Object.freeze({
  'infisical.auth.status':{risk:'READ',approval:false},
  'infisical.secret.list_metadata':{risk:'READ',approval:false},
  'infisical.secret.list_imported_metadata':{risk:'READ',approval:false},
  'infisical.secret.get_metadata':{risk:'READ',approval:false},
  'infisical.secret.exists':{risk:'READ',approval:false},
  'infisical.secret.create':{risk:'WRITE',approval:true},
  'infisical.secret.update':{risk:'WRITE',approval:true},
  'infisical.secret.delete':{risk:'DESTRUCTIVE',approval:true}
});
export function authorize(config,tool,payload,token){const p=TOOL_POLICY[tool];if(!p)throw new Error(`Unknown tool: ${tool}`);if(p.risk==='DESTRUCTIVE'&&!config.destructiveEnabled)throw new Error(`${tool} is disabled; set INFISICAL_ENABLE_DESTRUCTIVE=true`);if(!p.approval)return;if(!config.approvalSecret)throw new Error(`${tool} requires INFISICAL_APPROVAL_SECRET`);if(!token)throw new Error(`${tool} requires explicit approval_token`);const exp=approvalDigest(config.approvalSecret,tool,payload);const a=Buffer.from(token),b=Buffer.from(exp);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))throw new Error(`Invalid approval_token for ${tool}`);}
