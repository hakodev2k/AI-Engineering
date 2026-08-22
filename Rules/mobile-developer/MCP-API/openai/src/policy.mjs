import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const TOOL_RISK = Object.freeze({
  'openai.model.list': 'READ',
  'openai.model.get': 'READ',
  'openai.response.create': 'WRITE',
  'openai.response.get': 'READ',
  'openai.response.cancel': 'HIGH_RISK',
  'openai.moderation.create': 'READ',
  'openai.embedding.create': 'WRITE',
  'openai.vector_store.list': 'READ',
  'openai.vector_store.get': 'READ',
  'openai.vector_store.create': 'WRITE',
  'openai.vector_store.search': 'READ',
  'openai.file.list': 'READ',
  'openai.file.get': 'READ'
});

const usedApprovals = new Map();

function canonicalize(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const entries = Object.keys(value)
    .sort()
    .map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`);
  return `{${entries.join(',')}}`;
}

export function operationTarget(value) {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}

export function createApprovalToken(secret, tool, target, expiresAt, nonce) {
  return createHmac('sha256', secret)
    .update(`${tool}|${target}|${expiresAt}|${nonce}`)
    .digest('base64url');
}

function cleanupExpiredApprovals(now) {
  for (const [key, expiresAt] of usedApprovals) {
    if (expiresAt <= now) usedApprovals.delete(key);
  }
}

export function assertApproved(
  config,
  tool,
  target,
  approvalToken,
  approvalExpiresAt,
  approvalNonce,
  now = Date.now()
) {
  const risk = TOOL_RISK[tool] ?? 'DESTRUCTIVE';
  if (risk === 'READ') return;
  if (risk === 'WRITE' && !config.requireWriteApproval) return;
  if (risk === 'DESTRUCTIVE') throw new Error(`${tool} is disabled because it is classified as DESTRUCTIVE`);

  const maxExpiry = now + 5 * 60_000;
  if (!config.approvalSecret || config.approvalSecret.length < 32) {
    throw new Error('OPENAI_APPROVAL_SECRET with at least 32 characters is required for approved operations');
  }
  if (!approvalToken || !approvalExpiresAt || !approvalNonce) {
    throw new Error(`Approval required for ${tool}; target=${target}`);
  }
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(approvalNonce)) {
    throw new Error('approvalNonce must be 16-128 URL-safe characters');
  }
  if (!Number.isInteger(approvalExpiresAt) || approvalExpiresAt <= now || approvalExpiresAt > maxExpiry) {
    throw new Error('Approval expiry must be in the future and no more than 5 minutes away');
  }

  const expected = Buffer.from(createApprovalToken(config.approvalSecret, tool, target, approvalExpiresAt, approvalNonce));
  const actual = Buffer.from(approvalToken);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error('Invalid approval token for this exact OpenAI operation');
  }

  cleanupExpiredApprovals(now);
  const replayKey = createHash('sha256').update(approvalToken).digest('hex');
  if (usedApprovals.has(replayKey)) throw new Error('Approval token has already been used');
  usedApprovals.set(replayKey, approvalExpiresAt);
}

export function resetApprovalReplayCacheForTests() {
  usedApprovals.clear();
}
