export interface BitwardenAuthConfig { clientId:string; clientSecret:string; identityUrl:string }
export interface AccessToken { value:string; expiresAt:number }

export class BitwardenAuth {
  private cached?: AccessToken;
  constructor(private readonly config:BitwardenAuthConfig, private readonly fetcher:typeof fetch = fetch) {
    if (!config.clientId.startsWith('organization.')) throw new Error('BITWARDEN_CLIENT_ID must be an organization API client id');
    if (!config.clientSecret) throw new Error('BITWARDEN_CLIENT_SECRET is required');
  }
  async token(signal?:AbortSignal):Promise<string> {
    if (this.cached && this.cached.expiresAt > Date.now()+30_000) return this.cached.value;
    const body=new URLSearchParams({grant_type:'client_credentials',scope:'api.organization',client_id:this.config.clientId,client_secret:this.config.clientSecret});
    const r=await this.fetcher(`${this.config.identityUrl.replace(/\/$/,'')}/connect/token`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body,signal});
    if (!r.ok) throw new Error(`Bitwarden authentication failed (${r.status})`);
    const j=await r.json() as {access_token?:string;expires_in?:number};
    if (!j.access_token) throw new Error('Bitwarden authentication response did not contain an access token');
    this.cached={value:j.access_token,expiresAt:Date.now()+(j.expires_in??3600)*1000};
    return this.cached.value;
  }
  invalidate(){ this.cached=undefined; }
}
