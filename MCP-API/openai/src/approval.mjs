import { randomBytes } from 'node:crypto';
import { createApprovalToken, operationTarget, TOOL_RISK } from './policy.mjs';

function arg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const tool = arg('tool');
const payloadRaw = arg('payload');
const expiresInSeconds = Number(arg('expires-in') ?? '120');
const nonce = arg('nonce') ?? randomBytes(18).toString('base64url');
const secret = process.env.OPENAI_APPROVAL_SECRET;

if (!tool || !TOOL_RISK[tool] || TOOL_RISK[tool] === 'READ') {
  throw new Error('--tool must be a registered non-READ OpenAI tool');
}
if (!payloadRaw) throw new Error('--payload must contain the exact JSON tool arguments without approval fields');
if (!secret || secret.length < 32) throw new Error('OPENAI_APPROVAL_SECRET with at least 32 characters is required');
if (!Number.isInteger(expiresInSeconds) || expiresInSeconds < 1 || expiresInSeconds > 300) {
  throw new Error('--expires-in must be an integer from 1 to 300 seconds');
}

const payload = JSON.parse(payloadRaw);
const expiresAt = Date.now() + expiresInSeconds * 1000;
const target = operationTarget(payload);
const approvalToken = createApprovalToken(secret, tool, target, expiresAt, nonce);

process.stdout.write(JSON.stringify({ tool, target, approvalToken, approvalExpiresAt: expiresAt, approvalNonce: nonce }) + '\n');
