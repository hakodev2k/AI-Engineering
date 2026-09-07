import { timingSafeEqual } from 'node:crypto';

export const Risk = Object.freeze({ READ: 'READ', WRITE: 'WRITE', HIGH_RISK: 'HIGH_RISK', DESTRUCTIVE: 'DESTRUCTIVE' });

function safeEqual(a, b) {
  const aa = Buffer.from(a || '');
  const bb = Buffer.from(b || '');
  return aa.length === bb.length && aa.length > 0 && timingSafeEqual(aa, bb);
}

export function assertAllowed(tool, args, config) {
  if (tool.risk === Risk.READ) return;
  if (tool.risk === Risk.DESTRUCTIVE) throw new Error(`${tool.name} is disabled: destructive tools are not exposed by this connector.`);
  if (!config.allowWrites) throw new Error(`${tool.name} is disabled until CODA_ALLOW_WRITES=true.`);
  if (tool.risk === Risk.HIGH_RISK && !config.allowHighRisk) {
    throw new Error(`${tool.name} is high risk and disabled until CODA_ALLOW_HIGH_RISK=true.`);
  }
  if (!config.approvalToken || !safeEqual(args.approvalToken, config.approvalToken)) {
    throw new Error(`${tool.name} requires explicit human approval via a valid approvalToken.`);
  }
}
