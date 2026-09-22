export class PostmarkAuth {
  constructor(private readonly token: string) {
    if (!token?.trim()) throw new Error('POSTMARK_SERVER_TOKEN is required');
  }
  headers(): Record<string, string> {
    return { 'X-Postmark-Server-Token': this.token, Accept: 'application/json', 'Content-Type': 'application/json' };
  }
}

export function authFromEnv(env: NodeJS.ProcessEnv = process.env): PostmarkAuth {
  return new PostmarkAuth(env.POSTMARK_SERVER_TOKEN ?? '');
}
