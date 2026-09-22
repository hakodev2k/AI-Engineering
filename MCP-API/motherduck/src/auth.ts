export class MotherDuckAuth {
  constructor(private readonly token: string) { if (!token.trim()) throw new Error('MOTHERDUCK_TOKEN is required for non-interactive connector auth'); }
  headers(): Record<string,string> { return { Authorization: `Bearer ${this.token}` }; }
}
export const authFromEnv=(env:NodeJS.ProcessEnv=process.env)=>new MotherDuckAuth(env.MOTHERDUCK_TOKEN??'');
