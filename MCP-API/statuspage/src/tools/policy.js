import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';
export const TOOL_POLICY=Object.freeze({
'statuspage.page.get':{risk:'READ',approval:false},
'statuspage.component.list':{risk:'READ',approval:false},
'statuspage.component.get':{risk:'READ',approval:false},
'statuspage.component.update':{risk:'WRITE',approval:true},
'statuspage.incident.list':{risk:'READ',approval:false},
'statuspage.incident.get':{risk:'READ',approval:false},
'statuspage.incident.create':{risk:'HIGH_RISK',approval:true},
'statuspage.incident.update':{risk:'HIGH_RISK',approval:true},
'statuspage.incident.delete':{risk:'DESTRUCTIVE',approval:true}
});
export function authorize(config,tool,payload,token){const p=TOOL_POLICY[tool];if(!p)throw new Error(`Unknown tool: ${tool}`);if(p.risk==='DESTRUCTIVE'&&!config.destructiveEnabled)throw new Error(`${tool} is disabled; set STATUSPAGE_ENABLE_DESTRUCTIVE=true`);if(!p.approval)return;if(!config.approvalSecret)throw new Error(`${tool} requires STATUSPAGE_APPROVAL_SECRET`);if(!token)throw new Error(`${tool} requires explicit approval_token`);const expected=Buffer.from(approvalDigest(config.approvalSecret,tool,payload));const got=Buffer.from(token);if(expected.length!==got.length||!crypto.timingSafeEqual(expected,got))throw new Error(`Invalid approval_token for ${tool}`);}
