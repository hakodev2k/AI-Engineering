export interface RedditConfig {
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  userAgent: string;
  allowedSubreddits: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
  apiBaseUrl: string;
  tokenUrl: string;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): RedditConfig {
  const timeoutMs = Number(env.REDDIT_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.REDDIT_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('REDDIT_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('REDDIT_MAX_RETRIES must be 0..5');
  if (!env.REDDIT_ACCESS_TOKEN && !env.REDDIT_REFRESH_TOKEN) throw new Error('REDDIT_ACCESS_TOKEN or REDDIT_REFRESH_TOKEN is required');
  if (env.REDDIT_REFRESH_TOKEN && (!env.REDDIT_CLIENT_ID || !env.REDDIT_CLIENT_SECRET)) throw new Error('REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required with REDDIT_REFRESH_TOKEN');
  const userAgent = env.REDDIT_USER_AGENT?.trim();
  if (!userAgent) throw new Error('REDDIT_USER_AGENT is required');
  return {
    accessToken: env.REDDIT_ACCESS_TOKEN,
    refreshToken: env.REDDIT_REFRESH_TOKEN,
    clientId: env.REDDIT_CLIENT_ID,
    clientSecret: env.REDDIT_CLIENT_SECRET,
    userAgent,
    allowedSubreddits: csvSet(env.REDDIT_ALLOWED_SUBREDDITS),
    approvalSecret: env.REDDIT_APPROVAL_SECRET,
    timeoutMs,
    maxRetries,
    apiBaseUrl: 'https://oauth.reddit.com',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token'
  };
}

export function assertSubredditAllowed(config: RedditConfig, subreddit?: string) {
  if (!subreddit || config.allowedSubreddits.size === 0) return;
  if (!config.allowedSubreddits.has(subreddit.toLowerCase())) throw new Error(`Subreddit not allowed: ${subreddit}`);
}
