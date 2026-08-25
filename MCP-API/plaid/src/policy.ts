import crypto from 'node:crypto';
import { approvalDigest, type Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export interface Policy { risk: Risk; approval: boolean; }

export const TOOL_POLICY: Record<string, Policy> = {
  'plaid.item.get': { risk: 'READ', approval: false },
  'plaid.accounts.get': { risk: 'READ', approval: false },
  'plaid.transactions.sync': { risk: 'READ', approval: false },
  'plaid.transactions.get': { risk: 'READ', approval: false },
  'plaid.transactions.recurring.get': { risk: 'READ', approval: false },
  'plaid.transactions.refresh': { risk: 'WRITE', approval: true },
  'plaid.identity.get': { risk: 'READ', approval: false },
  'plaid.investments.holdings.get': { risk: 'READ', approval: false },
  'plaid.investments.transactions.get': { risk: 'READ', approval: false },
  'plaid.investments.refresh': { risk: 'WRITE', approval: true },
  'plaid.liabilities.get': { risk: 'READ', approval: false },
  'plaid.auth.get': { risk: 'HIGH_RISK', approval: true }
};

export function assertApproval(config: Config, tool: string, payload: unknown, approvalId?: string): void {
  const policy = TOOL_POLICY[tool];
  if (!policy) throw new Error(`Unknown tool policy: ${tool}`);
  if (!policy.approval) return;
  if (policy.risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires PLAID_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit approval`);
  const expected = approvalDigest(config.approvalSecret, tool, payload);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
