import { describe, expect, it, vi } from 'vitest';
import { registerCronitorTools } from '../src/tools.js';
import { loadConfig } from '../src/config.js';
import { CronitorClient } from '../src/client.js';

class FakeServer {
  names: string[] = [];
  registerTool(name: string): void { this.names.push(name); }
}

describe('tool registration', () => {
  it('registers the documented stable provider-scoped tools', () => {
    const server = new FakeServer();
    const config = loadConfig({ CRONITOR_API_KEY: 'test' } as NodeJS.ProcessEnv);
    const client = new CronitorClient(config, vi.fn() as unknown as typeof fetch);
    registerCronitorTools(server as never, client, config);
    expect(server.names).toEqual([
      'cronitor.monitor.list', 'cronitor.monitor.get', 'cronitor.monitor.create', 'cronitor.monitor.update', 'cronitor.monitor.pause', 'cronitor.monitor.delete',
      'cronitor.issue.list', 'cronitor.issue.get', 'cronitor.issue.create', 'cronitor.issue.update', 'cronitor.issue.delete',
      'cronitor.statuspage.list', 'cronitor.statuspage.get', 'cronitor.statuspage.create', 'cronitor.statuspage.update', 'cronitor.statuspage.delete',
      'cronitor.telemetry.send'
    ]);
  });
});
