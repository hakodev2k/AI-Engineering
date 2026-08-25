import { approvalToken, timingSafeEqualText } from './auth.js';
import type { SquareConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean; scope: string }> = {
  'square.location.list': { risk: 'READ', approval: false, scope: 'MERCHANT_PROFILE_READ' },
  'square.location.get': { risk: 'READ', approval: false, scope: 'MERCHANT_PROFILE_READ' },
  'square.catalog.list': { risk: 'READ', approval: false, scope: 'ITEMS_READ' },
  'square.catalog.search': { risk: 'READ', approval: false, scope: 'ITEMS_READ' },
  'square.customer.search': { risk: 'READ', approval: false, scope: 'CUSTOMERS_READ' },
  'square.customer.get': { risk: 'READ', approval: false, scope: 'CUSTOMERS_READ' },
  'square.customer.create': { risk: 'WRITE', approval: true, scope: 'CUSTOMERS_WRITE' },
  'square.customer.update': { risk: 'WRITE', approval: true, scope: 'CUSTOMERS_WRITE' },
  'square.order.search': { risk: 'READ', approval: false, scope: 'ORDERS_READ' },
  'square.order.get': { risk: 'READ', approval: false, scope: 'ORDERS_READ' },
  'square.order.create': { risk: 'WRITE', approval: true, scope: 'ORDERS_WRITE' },
  'square.payment.list': { risk: 'READ', approval: false, scope: 'PAYMENTS_READ' },
  'square.payment.get': { risk: 'READ', approval: false, scope: 'PAYMENTS_READ' },
  'square.refund.create': { risk: 'HIGH_RISK', approval: true, scope: 'PAYMENTS_WRITE' }
};

export function enforcePolicy(config: SquareConfig, toolName: string, payload: unknown, provided?: string): void {
  const policy = TOOL_POLICY[toolName];
  if (!policy) throw new Error(`Unknown tool policy: ${toolName}`);
  const approvalNeeded = policy.risk === 'HIGH_RISK' || (policy.risk === 'WRITE' && config.requireWriteApproval);
  if (!approvalNeeded) return;
  if (!config.approvalSecret) throw new Error(`${toolName} requires SQUARE_APPROVAL_SECRET`);
  if (!provided) throw new Error(`${toolName} requires explicit approval`);
  const expected = approvalToken(config.approvalSecret, toolName, payload);
  if (!timingSafeEqualText(expected, provided)) throw new Error(`Invalid approval for ${toolName}`);
}
