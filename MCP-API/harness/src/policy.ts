export function requireWriteApproval(env=process.env): void {
  if (env['HARNESS_WRITE_APPROVED'] !== 'true') throw new Error('Human approval required: set HARNESS_WRITE_APPROVED=true for this execution');
}
