import crypto from 'node:crypto';
import { approvalDigest, type RenderConfig } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const TOOL_POLICY: Record<string, { risk: Risk; approval: boolean }> = {
  'render.workspace.list': { risk: 'READ', approval: false },
  'render.service.list': { risk: 'READ', approval: false },
  'render.service.get': { risk: 'READ', approval: false },
  'render.deploy.list': { risk: 'READ', approval: false },
  'render.deploy.get': { risk: 'READ', approval: false },
  'render.logs.list': { risk: 'READ', approval: false },
  'render.metrics.get': { risk: 'READ', approval: false },
  'render.project.list': { risk: 'READ', approval: false },
  'render.deploy.trigger': { risk: 'HIGH_RISK', approval: true },
  'render.service.restart': { risk: 'HIGH_RISK', approval: true },
  'render.service.suspend': { risk: 'HIGH_RISK', approval: true },
  'render.service.resume': { risk: 'HIGH_RISK', approval: true }
};

export function assertApproval(config: RenderConfig, tool: string, subject: string, approvalId?: string) {
  const policy = TOOL_POLICY[tool];
  if (!policy?.approval || !config.requireWriteApproval) return;
  if (!config.approvalSecret) throw new Error(`${tool} requires RENDER_APPROVAL_SECRET`);
  if (!approvalId) throw new Error(`${tool} requires explicit human approval`);
  const expected = approvalDigest(config.approvalSecret, tool, subject);
  const a = Buffer.from(approvalId);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Invalid approval for ${tool}`);
}
