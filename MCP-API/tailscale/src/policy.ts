import crypto from 'node:crypto';
import { approvalDigest, Config } from './config.js';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';
export const POLICY: Record<string,{risk:Risk;approval:boolean}> = {
  'tailscale.device.list': { risk:'READ', approval:false },
  'tailscale.device.get': { risk:'READ', approval:false },
  'tailscale.device.authorize': { risk:'HIGH_RISK', approval:true },
  'tailscale.device.remove': { risk:'DESTRUCTIVE', approval:true },
  'tailscale.routes.get': { risk:'READ', approval:false },
  'tailscale.routes.update': { risk:'HIGH_RISK', approval:true },
  'tailscale.dns.nameservers.get': { risk:'READ', approval:false },
  'tailscale.dns.preferences.get': { risk:'READ', approval:false },
  'tailscale.dns.searchpaths.get': { risk:'READ', approval:false },
  'tailscale.logs.configuration.list': { risk:'READ', approval:false }
};

function canonical(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string,unknown>;
  return `{${Object.keys(o).sort().filter(k=>k!=='approvalId').map(k=>`${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
}

export function assertApproval(cfg: Config, tool: string, input: Record<string,unknown>) {
  if (!POLICY[tool]?.approval) return;
  if (!cfg.approvalSecret) throw new Error(`${tool} requires TAILSCALE_APPROVAL_SECRET`);
  const provided = typeof input.approvalId === 'string' ? input.approvalId : '';
  if (!provided) throw new Error(`${tool} requires explicit approvalId`);
  const expected = approvalDigest(cfg.approvalSecret, tool, canonical(input));
  const a = Buffer.from(provided), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Invalid approval for ${tool}`);
}
