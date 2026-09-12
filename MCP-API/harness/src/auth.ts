export function requireHarnessToken(env = process.env): string {
  const value = env['HARNESS_API_KEY'];
  if (!value || value.trim().length < 8) throw new Error('HARNESS_API_KEY is required');
  return value;
}
