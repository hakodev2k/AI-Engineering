import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';
export const POLICY=Object.freeze({
  'convex.project.list':{risk:'READ'}, 'convex.project.get':{risk:'READ'}, 'convex.deployment.list':{risk:'READ'}, 'convex.deployment.get':{risk:'READ'}, 'convex.deployment.team_list':{risk:'READ'}, 'convex.deployment.region_list':{risk:'READ'}, 'convex.deployment.class_list':{risk:'READ'}, 'convex.team.member_list':{risk:'READ'}, 'convex.deployment.custom_domain_list':{risk:'READ'},
  'convex.project.delete':{risk:'DESTRUCTIVE',approval:true}, 'convex.deployment.delete':{risk:'DESTRUCTIVE',approval:true}
});
export function authorize(config, tool, payload, approvalToken){ const p=POLICY[tool]; if(!p) throw new Error(`Unknown tool: ${tool}`); if(p.risk==='DESTRUCTIVE'&&!config.destructiveEnabled) throw new Error(`${tool} is disabled; set CONVEX_ENABLE_DESTRUCTIVE=true`); if(!p.approval) return; if(!config.approvalSecret) throw new Error(`${tool} requires CONVEX_APPROVAL_SECRET`); if(!approvalToken) throw new Error(`${tool} requires approval_token`); const a=Buffer.from(approvalDigest(config.approvalSecret,tool,payload)); const b=Buffer.from(approvalToken); if(a.length!==b.length||!crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval_token for ${tool}`); }
