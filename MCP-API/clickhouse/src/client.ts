import { createClient, type ClickHouseClient } from '@clickhouse/client';
import type { ConnectorConfig } from './config.js';

export class ClickHouseConnectorClient {
  private readonly client: ClickHouseClient;
  constructor(private readonly config: ConnectorConfig) {
    this.client = createClient({
      url: config.url,
      username: config.username,
      password: config.password,
      database: config.database,
      request_timeout: config.requestTimeoutMs,
      clickhouse_settings: { max_execution_time: config.maxExecutionTimeSeconds }
    });
  }

  async queryJson(query: string): Promise<unknown[]> {
    const result = await this.client.query({ query, format: 'JSONEachRow' });
    return await result.json();
  }

  async exec(query: string): Promise<void> {
    await this.client.command({ query, clickhouse_settings: { wait_end_of_query: 1 } });
  }

  async insert(table: string, rows: Record<string, unknown>[]): Promise<void> {
    await this.client.insert({ table, values: rows, format: 'JSONEachRow' });
  }

  async close(): Promise<void> { await this.client.close(); }
}
