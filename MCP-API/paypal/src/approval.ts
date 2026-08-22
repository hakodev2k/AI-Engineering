import { createApprovalToken } from "./policy.js";

const [tool, target, expiresRaw] = process.argv.slice(2);
const secret = process.env.PAYPAL_APPROVAL_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("PAYPAL_APPROVAL_SECRET must be set to at least 32 characters.");
}
if (!tool || !target || !expiresRaw) {
  throw new Error("Usage: npm run approval -- <tool> <target> <expiresAtEpochMs>");
}

const expiresAt = Number(expiresRaw);
if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() || expiresAt > Date.now() + 5 * 60_000) {
  throw new Error("expiresAtEpochMs must be a future epoch-millisecond timestamp no more than 5 minutes from now.");
}

process.stdout.write(`${createApprovalToken(secret, tool, target, expiresAt)}\n`);
