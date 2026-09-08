import { config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export class ApprovalError extends Error {
  constructor(public readonly risk: Risk, message: string) {
    super(message);
    this.name = 'ApprovalError';
  }
}

export function requireRisk(risk: Risk, approved = false): void {
  if (risk === 'READ') return;
  if (risk === 'WRITE') {
    if (!config.allowWrite && !approved) throw new ApprovalError(risk, 'WRITE operation requires approval or TRIGGER_ALLOW_WRITE=true');
    return;
  }
  if (risk === 'HIGH_RISK') {
    if (!config.allowHighRisk || !approved) throw new ApprovalError(risk, 'HIGH_RISK operation requires TRIGGER_ALLOW_HIGH_RISK=true and approved=true');
    return;
  }
  throw new ApprovalError(risk, 'DESTRUCTIVE operations are not implemented by this connector');
}

export const TOOL_RISK: Record<string, Risk> = {
  'trigger-dev.task.trigger': 'WRITE',
  'trigger-dev.task.batch_trigger': 'WRITE',
  'trigger-dev.run.list': 'READ',
  'trigger-dev.run.get': 'READ',
  'trigger-dev.run.cancel': 'HIGH_RISK',
  'trigger-dev.run.replay': 'HIGH_RISK',
  'trigger-dev.run.reschedule': 'WRITE',
  'trigger-dev.batch.get': 'READ',
  'trigger-dev.batch.results': 'READ',
  'trigger-dev.schedule.list': 'READ',
  'trigger-dev.schedule.get': 'READ',
};
