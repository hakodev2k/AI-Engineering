import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export const TOOL_POLICY = Object.freeze({
  'browserstack.automate.plan.get': { risk: 'READ', approval: false },
  'browserstack.automate.browser.list': { risk: 'READ', approval: false },
  'browserstack.project.list': { risk: 'READ', approval: false },
  'browserstack.project.get': { risk: 'READ', approval: false },
  'browserstack.build.list': { risk: 'READ', approval: false },
  'browserstack.session.list': { risk: 'READ', approval: false },
  'browserstack.session.get': { risk: 'READ', approval: false },
  'browserstack.session.logs.get': { risk: 'READ', approval: false },
  'browserstack.session.console_logs.get': { risk: 'READ', approval: false },
  'browserstack.session.network_logs.get': { risk: 'READ', approval: false },
  'browserstack.session.update_status': { risk: 'WRITE', approval: true },
  'browserstack.session.update_name': { risk: 'WRITE', approval: true },
  'browserstack.session.delete': { risk: 'DESTRUCTIVE', approval: true },
  'browserstack.build.delete': { risk: 'DESTRUCTIVE', approval: true }
});

export function authorize(config, tool, payload, approvalToken) {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool: ${tool}`);
  if (policy.risk === 'DESTRUCTIVE' && !config.destructiveEnabled) {
    throw new Error(`${tool} is disabled; set BROWSERSTACK_ENABLE_DESTRUCTIVE=true to enable destructive operations`);
  }
  if (!policy.approval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires BROWSERSTACK_APPROVAL_SECRET`);
  if (!approvalToken) throw new Error(`${tool} requires explicit approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalToken);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval_token for ${tool}`);
}
