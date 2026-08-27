import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { ConnectorConfig } from './config.js';

export type Upstream = {
  call(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
};

export async function connectOfficialMcp(config: ConnectorConfig): Promise<Upstream> {
  const childEnv: Record<string, string> = {
    SONARQUBE_TOKEN: config.token,
    SONARQUBE_ORG: config.org,
    SONARQUBE_TOOLSETS: 'issues,projects,quality-gates,rules,measures,security-hotspots',
    SONARQUBE_READ_ONLY: 'false'
  };
  if (config.url) childEnv.SONARQUBE_URL = config.url;
  if (config.projectKey) childEnv.SONARQUBE_PROJECT_KEY = config.projectKey;

  const transport = new StdioClientTransport({
    command: 'docker',
    args: [
      'run', '--init', '--pull=always', '-i', '--rm',
      '-e', 'SONARQUBE_TOKEN',
      '-e', 'SONARQUBE_ORG',
      '-e', 'SONARQUBE_TOOLSETS',
      '-e', 'SONARQUBE_READ_ONLY',
      ...(config.url ? ['-e', 'SONARQUBE_URL'] : []),
      ...(config.projectKey ? ['-e', 'SONARQUBE_PROJECT_KEY'] : []),
      'sonarsource/sonarqube-mcp'
    ],
    env: childEnv,
    stderr: 'inherit'
  });

  const client = new Client({ name: 'ai-engineering-sonarqube-cloud-wrapper', version: '1.0.0' });
  await client.connect(transport);

  return {
    async call(name, args) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        return await client.callTool({ name, arguments: args }, undefined, { signal: controller.signal });
      } finally {
        clearTimeout(timer);
      }
    },
    async close() {
      await client.close();
    }
  };
}
