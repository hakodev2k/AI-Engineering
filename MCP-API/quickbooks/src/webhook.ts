import crypto from 'node:crypto';

export function verifyQuickBooksWebhook(rawBody: string | Buffer, signature: string | undefined, verifierToken: string | undefined): boolean {
  if (!signature || !verifierToken) return false;
  const expected = crypto.createHmac('sha256', verifierToken).update(rawBody).digest('base64');
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
