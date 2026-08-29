import crypto from 'node:crypto';
import { approvalDigest } from '../auth/config.js';
export const TOOL_POLICY=Object.freeze({
  'mailgun.domain.list':{risk:'READ',approval:false},
  'mailgun.domain.get':{risk:'READ',approval:false},
  'mailgun.logs.query':{risk:'READ',approval:false},
  'mailgun.metrics.query':{risk:'READ',approval:false},
  'mailgun.template.list':{risk:'READ',approval:false},
  'mailgun.template.get':{risk:'READ',approval:false},
  'mailgun.template.create':{risk:'WRITE',approval:true},
  'mailgun.mailing_list.list':{risk:'READ',approval:false},
  'mailgun.mailing_list.member.list':{risk:'READ',approval:false},
  'mailgun.route.list':{risk:'READ',approval:false},
  'mailgun.route.get':{risk:'READ',approval:false},
  'mailgun.suppression.bounce.list':{risk:'READ',approval:false},
  'mailgun.suppression.complaint.list':{risk:'READ',approval:false},
  'mailgun.message.send':{risk:'HIGH_RISK',approval:true}
});
export function authorize(config,tool,payload,token){
  const policy=TOOL_POLICY[tool]; if(!policy) throw new Error(`Unknown tool: ${tool}`);
  if(policy.risk==='HIGH_RISK'&&!config.highRiskEnabled) throw new Error(`${tool} is disabled by MAILGUN_ENABLE_HIGH_RISK=false`);
  if(!policy.approval) return;
  if(!config.approvalSecret) throw new Error(`${tool} requires MAILGUN_APPROVAL_SECRET`);
  if(!token) throw new Error(`${tool} requires explicit approval_token`);
  const expected=Buffer.from(approvalDigest(config.approvalSecret,tool,payload)); const actual=Buffer.from(token);
  if(expected.length!==actual.length||!crypto.timingSafeEqual(expected,actual)) throw new Error(`Invalid approval_token for ${tool}`);
}
