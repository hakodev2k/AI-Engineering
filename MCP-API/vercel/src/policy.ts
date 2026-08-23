import crypto from 'node:crypto';
import { approvalDigest } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`${tool} requires approval but VERCEL_APPROVAL_SECRET is not configured`);
  if (!approvalId || approvalId.length !== 64) throw new Error(`${tool} requires a 64-character approvalId`);
  const expected = approvalDigest(secret, tool);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(approvalId, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error(`Approval denied for ${tool}`);
}

export const risk: Record<string, Risk> = {
  'vercel.project.list':'READ','vercel.project.get':'READ','vercel.deployment.list':'READ','vercel.deployment.get':'READ','vercel.deployment.logs':'READ','vercel.environment.list':'READ','vercel.domain.list':'READ',
  'vercel.deployment.create':'WRITE','vercel.environment.create':'WRITE','vercel.environment.update':'WRITE','vercel.domain.add':'WRITE','vercel.domain.verify':'WRITE',
  'vercel.deployment.cancel':'HIGH_RISK','vercel.environment.delete':'DESTRUCTIVE','vercel.domain.remove':'DESTRUCTIVE'
};
