import crypto from 'node:crypto';
import { approvalDigest } from './config.js';
export const POLICY = Object.freeze({
  'posthog.project.get': ['READ', false],
  'posthog.dashboard.list': ['READ', false],
  'posthog.dashboard.get': ['READ', false],
  'posthog.insight.list': ['READ', false],
  'posthog.insight.get': ['READ', false],
  'posthog.feature_flag.list': ['READ', false],
  'posthog.feature_flag.get': ['READ', false],
  'posthog.feature_flag.create': ['WRITE', true],
  'posthog.feature_flag.update': ['HIGH_RISK', true],
  'posthog.feature_flag.delete': ['DESTRUCTIVE', true],
  'posthog.person.list': ['READ', false],
  'posthog.person.get': ['READ', false]
});
export function authorize(config, tool, payload, token) {
  const p = POLICY[tool];
  if (!p) throw new Error(`Unknown tool ${tool}`);
  if (p[0] === 'DESTRUCTIVE' && !config.destructiveEnabled) throw new Error(`${tool} is disabled by default`);
  if (!p[1]) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires POSTHOG_APPROVAL_SECRET`);
  if (!token) throw new Error(`${tool} requires approval_token`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(token); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval_token for ${tool}`);
}
