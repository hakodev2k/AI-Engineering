import { createHmac, timingSafeEqual } from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function approvalFor(tool: string, secret: string): string {
  return createHmac('sha256', secret).update(`runpod:${tool}`).digest('hex');
}

export function assertApproval(tool: string, supplied: string | undefined, secret: string): void {
  if (!supplied) throw new Error(`Human approval required for ${tool}`);
  const expected = approvalFor(tool, secret);
  const a = Buffer.from(supplied, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error(`Invalid approval for ${tool}`);
  }
}

export const TOOL_RISKS: Record<string, Risk> = {
  'runpod.gpu.list': 'READ',
  'runpod.datacenter.list': 'READ',
  'runpod.pod.list': 'READ',
  'runpod.pod.get': 'READ',
  'runpod.endpoint.list': 'READ',
  'runpod.endpoint.get': 'READ',
  'runpod.endpoint.health': 'READ',
  'runpod.job.get': 'READ',
  'runpod.template.list': 'READ',
  'runpod.volume.list': 'READ',
  'runpod.pod.create': 'HIGH_RISK',
  'runpod.pod.stop': 'HIGH_RISK',
  'runpod.endpoint.create': 'HIGH_RISK',
  'runpod.endpoint.job.run': 'HIGH_RISK'
};
