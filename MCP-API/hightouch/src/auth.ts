export function getApiKey(): string {
  const key = process.env.HIGHTOUCH_API_KEY?.trim();
  if (!key) throw new Error('HIGHTOUCH_API_KEY is required');
  return key;
}
