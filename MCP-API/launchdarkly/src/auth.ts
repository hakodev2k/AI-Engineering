export interface CredentialProvider{getAccessToken():Promise<string>}
export class EnvCredentialProvider implements CredentialProvider{async getAccessToken(){const v=process.env.LAUNCHDARKLY_ACCESS_TOKEN?.trim();if(!v)throw new Error('LAUNCHDARKLY_ACCESS_TOKEN is required');return v}}
