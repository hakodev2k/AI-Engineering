import type { Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function requireApproval(config: Config, risk: Risk, toolName: string): void {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error(`${toolName} is disabled: destructive operations are not exposed`);
  if (!config.writeApproved) {
    throw new Error(`${toolName} requires explicit human approval. Set AHA_WRITE_APPROVED=true only for the approved execution window.`);
  }
}
