export class EasyPostCredentialProvider {
  constructor(private readonly apiKey: string) {}
  authorizationHeader(): string {
    return `Basic ${Buffer.from(`${this.apiKey}:`, 'utf8').toString('base64')}`;
  }
}
