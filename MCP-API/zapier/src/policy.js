import crypto from 'node:crypto';

const WRITE = /(create|send|post|update|edit|add|remove|delete|publish|reply|upload|move|execute|run)/i;
const DESTRUCTIVE = /(delete|remove|cancel|revoke|disable|terminate)/i;

export function classify(tool) {
  const text = `${tool.name} ${tool.description ?? ''}`;
  if (DESTRUCTIVE.test(text)) return 'DESTRUCTIVE';
  if (WRITE.test(text)) return 'WRITE';
  return 'READ';
}

export function approvalToken(secret, toolName, args) {
  const payload = `${toolName}\n${JSON.stringify(args)}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function authorize({ secret, toolName, args, suppliedToken, risk }) {
  if (risk === 'READ') return;
  if (risk === 'DESTRUCTIVE') throw new Error('Destructive Zapier actions are disabled by policy');
  const expected = approvalToken(secret, toolName, args);
  if (!suppliedToken || suppliedToken.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(suppliedToken), Buffer.from(expected))) {
    throw new Error('Explicit human approval is required for this write action');
  }
}
