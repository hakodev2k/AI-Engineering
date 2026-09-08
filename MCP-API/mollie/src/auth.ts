export interface CredentialProvider {
  getAccessToken(): Promise<string>;
}

export class EnvCredentialProvider implements CredentialProvider {
  constructor(private readonly env: NodeJS.ProcessEnv = process.env) {}

  async getAccessToken(): Promise<string> {
    const token = this.env.MOLLIE_ACCESS_TOKEN?.trim();
    if (!token) throw new Error("MOLLIE_ACCESS_TOKEN is required");
    if (/[\r\n]/.test(token)) throw new Error("MOLLIE_ACCESS_TOKEN contains invalid characters");
    return token;
  }
}
