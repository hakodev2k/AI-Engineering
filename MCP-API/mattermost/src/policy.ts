import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'mattermost.user.me': { risk: 'READ', approval: false },
  'mattermost.team.list': { risk: 'READ', approval: false },
  'mattermost.channel.list': { risk: 'READ', approval: false },
  'mattermost.channel.get': { risk: 'READ', approval: false },
  'mattermost.channel.search': { risk: 'READ', approval: false },
  'mattermost.post.get': { risk: 'READ', approval: false },
  'mattermost.post.search': { risk: 'READ', approval: false },
  'mattermost.post.create': { risk: 'WRITE', approval: true },
  'mattermost.post.update': { risk: 'WRITE', approval: true },
  'mattermost.post.delete': { risk: 'DESTRUCTIVE', approval: true },
  'mattermost.reaction.list': { risk: 'READ', approval: false },
  'mattermost.reaction.add': { risk: 'WRITE', approval: true },
  'mattermost.reaction.remove': { risk: 'WRITE', approval: true }
};

export function assertAllowed(tool: string, approval: string | undefined, config: Config): void {
  const p = TOOL_POLICY[tool];
  if (!p) throw new Error(`Unknown tool policy: ${tool}`);
  if (p.risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new Error(`${tool} is disabled; set MATTERMOST_ENABLE_DESTRUCTIVE=true`);
  if (!p.approval) return;
  if (!config.approvalSecret || !approval) throw new Error(`${tool} requires explicit approval`);
  const expected = Buffer.from(approvalDigest(config.approvalSecret, tool));
  const actual = Buffer.from(approval);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error(`Invalid approval for ${tool}`);
}
