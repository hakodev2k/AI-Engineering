export const Risk = Object.freeze({ READ: 'READ', WRITE: 'WRITE', HIGH_RISK: 'HIGH_RISK' });

export function permissionsFromEnv(value = process.env.NETBIRD_ALLOWED_PERMISSIONS || 'READ') {
  return new Set(value.split(',').map(x => x.trim()).filter(Boolean));
}

export function authorize(risk, approval) {
  const allowed = permissionsFromEnv();
  if (!allowed.has(risk)) throw new Error(`Permission denied: ${risk} is not enabled`);
  if (risk === Risk.HIGH_RISK) {
    const expected = process.env.NETBIRD_APPROVAL_TOKEN;
    if (!expected || !approval || approval !== expected) {
      throw new Error('Explicit human approval is required for this access-control mutation');
    }
  }
}

export function safeId(value, field = 'id') {
  if (typeof value !== 'string' || !/^[A-Za-z0-9._:-]{1,200}$/.test(value)) throw new Error(`Invalid ${field}`);
  return value;
}

export function groupBody(name, peers) {
  if (typeof name !== 'string' || name.trim().length < 1 || name.length > 128) throw new Error('Invalid group name');
  if (!Array.isArray(peers) || peers.length > 10000) throw new Error('peers must be an array with at most 10000 entries');
  return { name: name.trim(), peers: peers.map((p) => safeId(p, 'peer id')) };
}
