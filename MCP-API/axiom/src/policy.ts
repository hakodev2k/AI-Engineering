import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'DESTRUCTIVE';
export class ApprovalRequiredError extends Error {
  constructor(public readonly action: string) { super(`Human approval required for ${action}`); }
}
export class DestructiveDisabledError extends Error {
  constructor(public readonly action: string) { super(`Destructive action disabled: ${action}`); }
}
export const actionKey = (tool: string, ...ids: string[]): string => [tool, ...ids].join(':');

export function authorize(config: Config, risk: Risk, action: string): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE' && !config.enableDestructive) throw new DestructiveDisabledError(action);
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (!config.approvedActions.has(action)) throw new ApprovalRequiredError(action);
}
