import crypto from 'node:crypto';

export function requireSubmissionApproval(tool: string, sha256: string, approval: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error('HIGH_RISK operation disabled: VIRUSTOTAL_APPROVAL_SECRET is not configured');
  if (!approval) throw new Error('Explicit human approval is required for public sample submission');
  const expected = crypto.createHmac('sha256', secret).update(`${tool}:${sha256}`).digest('hex');
  const a = Buffer.from(approval, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error('Invalid approval receipt');
}

export function assertSubmissionAllowed(sha256: string, allowlist: Set<string>) {
  if (allowlist.size > 0 && !allowlist.has(sha256.toLowerCase())) {
    throw new Error('File hash is not in VIRUSTOTAL_SUBMIT_SHA256_ALLOWLIST');
  }
}
