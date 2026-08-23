export type XeroConfig = {
  bearerToken?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string;
  writeAllowed: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): XeroConfig {
  const bearerToken = env.XERO_CLIENT_BEARER_TOKEN?.trim();
  const clientId = env.XERO_CLIENT_ID?.trim();
  const clientSecret = env.XERO_CLIENT_SECRET?.trim();
  if (!bearerToken && !(clientId && clientSecret)) {
    throw new Error('AUTH_CONFIG_ERROR: set XERO_CLIENT_BEARER_TOKEN or both XERO_CLIENT_ID and XERO_CLIENT_SECRET');
  }
  return {
    bearerToken,
    clientId,
    clientSecret,
    scopes: env.XERO_SCOPES?.trim() || undefined,
    writeAllowed: env.XERO_WRITE_MODE === 'allow'
  };
}

export function assertWriteAllowed(config: XeroConfig, tool: string): void {
  if (!config.writeAllowed) {
    throw new Error(`APPROVAL_REQUIRED: ${tool} is disabled until an operator sets XERO_WRITE_MODE=allow`);
  }
}
