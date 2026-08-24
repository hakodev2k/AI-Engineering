export interface N8nConfig {
  baseUrl: string;
  apiKey: string;
  mcpUrl?: string;
  mcpToken?: string;
  enableMcp: boolean;
  allowedProjectIds: Set<string>;
  allowedWorkflowIds: Set<string>;
  approvalSecret?: string;
  timeoutMs: number;
  maxRetries: number;
}

function csvSet(value?: string) {
  return new Set((value ?? '').split(',').map(v => v.trim()).filter(Boolean));
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): N8nConfig {
  const rawBase = env.N8N_BASE_URL?.trim();
  if (!rawBase) throw new Error('N8N_BASE_URL is required');
  const url = new URL(rawBase);
  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') throw new Error('N8N_BASE_URL must use HTTPS except for localhost');
  if (!env.N8N_API_KEY) throw new Error('N8N_API_KEY is required');
  const timeoutMs = Number(env.N8N_TIMEOUT_MS ?? 15000);
  const maxRetries = Number(env.N8N_MAX_RETRIES ?? 3);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 120000) throw new Error('N8N_TIMEOUT_MS must be 1000..120000');
  if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 5) throw new Error('N8N_MAX_RETRIES must be 0..5');
  const enableMcp = (env.N8N_ENABLE_MCP ?? 'true').toLowerCase() === 'true';
  const mcpUrl = env.N8N_MCP_URL?.trim() || undefined;
  if (mcpUrl) {
    const u = new URL(mcpUrl);
    if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') throw new Error('N8N_MCP_URL must use HTTPS except for localhost');
  }
  return {
    baseUrl: rawBase.replace(/\/$/, ''),
    apiKey: env.N8N_API_KEY,
    mcpUrl,
    mcpToken: env.N8N_MCP_TOKEN,
    enableMcp,
    allowedProjectIds: csvSet(env.N8N_ALLOWED_PROJECT_IDS),
    allowedWorkflowIds: csvSet(env.N8N_ALLOWED_WORKFLOW_IDS),
    approvalSecret: env.N8N_APPROVAL_SECRET,
    timeoutMs,
    maxRetries
  };
}

export function assertProjectAllowed(config: N8nConfig, projectId?: string) {
  if (projectId && config.allowedProjectIds.size && !config.allowedProjectIds.has(projectId)) throw new Error(`Project not allowed: ${projectId}`);
}

export function assertWorkflowAllowed(config: N8nConfig, workflowId?: string) {
  if (workflowId && config.allowedWorkflowIds.size && !config.allowedWorkflowIds.has(workflowId)) throw new Error(`Workflow not allowed: ${workflowId}`);
}
