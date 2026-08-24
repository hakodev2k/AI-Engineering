export interface SpotifyConfig {
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  approvalSecret?: string;
  enableDestructive: boolean;
  timeoutMs: number;
  maxRetries: number;
  apiBaseUrl: string;
  tokenUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SpotifyConfig {
  const accessToken = env.SPOTIFY_ACCESS_TOKEN?.trim();
  const clientId = env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = env.SPOTIFY_REFRESH_TOKEN?.trim();
  if (!accessToken && !(clientId && clientSecret && refreshToken)) {
    throw new Error('Set SPOTIFY_ACCESS_TOKEN or SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET + SPOTIFY_REFRESH_TOKEN');
  }
  const timeoutMs = Number(env.SPOTIFY_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.SPOTIFY_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('SPOTIFY_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('SPOTIFY_MAX_RETRIES must be 0..5');
  return {
    accessToken,
    clientId,
    clientSecret,
    refreshToken,
    approvalSecret: env.SPOTIFY_APPROVAL_SECRET?.trim(),
    enableDestructive: env.SPOTIFY_ENABLE_DESTRUCTIVE === 'true',
    timeoutMs,
    maxRetries,
    apiBaseUrl: 'https://api.spotify.com/v1',
    tokenUrl: 'https://accounts.spotify.com/api/token'
  };
}
