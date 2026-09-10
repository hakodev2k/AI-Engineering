import crypto from 'node:crypto';

export const Risk = Object.freeze({ READ: 'READ', WRITE: 'WRITE', HIGH_RISK: 'HIGH_RISK', DESTRUCTIVE: 'DESTRUCTIVE' });

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stableJson(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function approvalFor(secret, toolName, args) {
  return crypto.createHmac('sha256', secret).update(`${toolName}\n${stableJson(args)}`).digest('hex');
}

export function enforcePolicy(config, toolName, risk, args) {
  if (risk === Risk.READ) return;
  if (risk === Risk.WRITE && !config.allowWrite) throw new Error('WRITE operations are disabled');
  if (risk === Risk.HIGH_RISK && !config.allowHighRisk) throw new Error('HIGH_RISK operations are disabled');
  if (risk === Risk.DESTRUCTIVE && !config.allowDestructive) throw new Error('DESTRUCTIVE operations are disabled');
  if (!config.approvalSecret) throw new Error('TEMPORAL_CLOUD_APPROVAL_SECRET is required for mutating tools');
  const supplied = args.approvalToken;
  if (typeof supplied !== 'string' || supplied.length !== 64) throw new Error('Valid approvalToken is required');
  const payload = {...args}; delete payload.approvalToken;
  const expected = approvalFor(config.approvalSecret, toolName, payload);
  const a = Buffer.from(supplied, 'hex'); const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Approval token does not match this exact action');
}
