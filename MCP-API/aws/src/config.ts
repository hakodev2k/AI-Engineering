export type AwsConfig = {
  region: string;
  allowedRegions: Set<string>;
  allowedBuckets: Set<string>;
  allowedFunctionPrefixes: string[];
  approvalSecret?: string;
  mcpEndpoint: string;
  mcpAccessToken?: string;
  preferMcp: boolean;
  timeoutMs: number;
};

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AwsConfig {
  const region = env.AWS_REGION ?? env.AWS_DEFAULT_REGION ?? 'us-east-1';
  const timeoutMs = Number(env.AWS_CONNECTOR_TIMEOUT_MS ?? 15000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) {
    throw new Error('AWS_CONNECTOR_TIMEOUT_MS must be an integer between 1000 and 120000');
  }
  const allowedRegions = csvSet(env.AWS_CONNECTOR_ALLOWED_REGIONS);
  if (allowedRegions.size && !allowedRegions.has(region)) {
    throw new Error(`Default AWS region is not allowlisted: ${region}`);
  }
  return {
    region,
    allowedRegions,
    allowedBuckets: csvSet(env.AWS_CONNECTOR_ALLOWED_BUCKETS),
    allowedFunctionPrefixes: (env.AWS_CONNECTOR_ALLOWED_FUNCTION_PREFIXES ?? '').split(',').map(v => v.trim()).filter(Boolean),
    approvalSecret: env.AWS_CONNECTOR_APPROVAL_SECRET,
    mcpEndpoint: env.AWS_MCP_ENDPOINT ?? 'https://aws-mcp.us-east-1.api.aws/mcp',
    mcpAccessToken: env.AWS_MCP_ACCESS_TOKEN,
    preferMcp: (env.AWS_CONNECTOR_PREFER_MCP ?? 'true').toLowerCase() !== 'false',
    timeoutMs
  };
}

export function assertRegionAllowed(config: AwsConfig, region: string) {
  if (config.allowedRegions.size && !config.allowedRegions.has(region)) throw new Error(`AWS region not allowed: ${region}`);
}

export function assertBucketAllowed(config: AwsConfig, bucket: string) {
  if (config.allowedBuckets.size && !config.allowedBuckets.has(bucket)) throw new Error(`S3 bucket not allowed: ${bucket}`);
}

export function assertFunctionAllowed(config: AwsConfig, name: string) {
  if (config.allowedFunctionPrefixes.length && !config.allowedFunctionPrefixes.some(p => name.startsWith(p))) {
    throw new Error(`Lambda function not allowed: ${name}`);
  }
}
