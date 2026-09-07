export interface CredentialProvider {
  getAccessKey(): string;
}

export class StaticCredentialProvider implements CredentialProvider {
  constructor(private readonly accessKey: string) {
    if (!accessKey) throw new Error('bunny.net API key is required.');
  }

  getAccessKey(): string {
    return this.accessKey;
  }
}
