import { z } from 'zod';
import type { ConnectorConfig } from './config.js';
import { ClickHouseConnectorClient } from './client.js';
import { Identifier, QualifiedTable, assertReadonlyQuery, quoteIdentifier, quoteQualifiedTable, requireDestructive, requireHighRisk, requireWrite } from './policy.js';

const Approval = z.object({ approved: z.boolean().optional() }).strict();
const Table = z.object({ table: QualifiedTable }).strict();
const Limit = z.number().int().positive().max(1000).default(100);

export type ToolDefinition = {
  name: string; description: string; risk: 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
  approval: 'none'|'configurable'|'explicit'; inputSchema: z.ZodTypeAny;
  run(input: unknown): Promise<unknown>;
};

export function buildTools(client: ClickHouseConnectorClient, config: ConnectorConfig): ToolDefinition[] {
  return [
    { name:'clickhouse.database.list', description:'List visible databases.', risk:'READ', approval:'none', inputSchema:z.object({}).strict(), run:async()=>client.queryJson('SHOW DATABASES') },
    { name:'clickhouse.table.list', description:'List tables in a database.', risk:'READ', approval:'none', inputSchema:z.object({ database:Identifier.optional() }).strict(), run:async(i)=>{ const {database}=z.object({database:Identifier.optional()}).strict().parse(i); return client.queryJson(`SHOW TABLES FROM ${quoteIdentifier(database ?? config.database)}`); } },
    { name:'clickhouse.table.describe', description:'Describe table columns and types.', risk:'READ', approval:'none', inputSchema:Table, run:async(i)=>{ const {table}=Table.parse(i); return client.queryJson(`DESCRIBE TABLE ${quoteQualifiedTable(table, config.database)}`); } },
    { name:'clickhouse.table.sample', description:'Read a bounded sample of rows.', risk:'READ', approval:'none', inputSchema:z.object({table:QualifiedTable,limit:Limit.optional()}).strict(), run:async(i)=>{ const {table,limit=100}=z.object({table:QualifiedTable,limit:Limit.optional()}).strict().parse(i); return client.queryJson(`SELECT * FROM ${quoteQualifiedTable(table,config.database)} LIMIT ${Math.min(limit,config.maxResultRows)}`); } },
    { name:'clickhouse.table.count', description:'Count rows in a table.', risk:'READ', approval:'none', inputSchema:Table, run:async(i)=>{ const {table}=Table.parse(i); return client.queryJson(`SELECT count() AS count FROM ${quoteQualifiedTable(table,config.database)}`); } },
    { name:'clickhouse.query.readonly', description:'Execute one validated read-only SQL statement with bounded output.', risk:'READ', approval:'none', inputSchema:z.object({sql:z.string().min(1).max(20000),limit:Limit.optional()}).strict(), run:async(i)=>{ const {sql,limit=config.maxResultRows}=z.object({sql:z.string().min(1).max(20000),limit:Limit.optional()}).strict().parse(i); assertReadonlyQuery(sql); return client.queryJson(`SELECT * FROM (${sql.trim().replace(/;+$/,'')}) LIMIT ${Math.min(limit,config.maxResultRows)}`); } },
    { name:'clickhouse.table.insert', description:'Insert JSON rows into an existing table.', risk:'WRITE', approval:'configurable', inputSchema:z.object({table:QualifiedTable,rows:z.array(z.record(z.unknown())).min(1).max(1000),approved:z.boolean().optional()}).strict(), run:async(i)=>{ const x=z.object({table:QualifiedTable,rows:z.array(z.record(z.unknown())).min(1).max(1000),approved:z.boolean().optional()}).strict().parse(i); requireWrite(config,x); await client.insert(x.table.includes('.')?x.table:`${config.database}.${x.table}`,x.rows); return {inserted:x.rows.length}; } },
    { name:'clickhouse.table.create', description:'Create a MergeTree table from validated column definitions.', risk:'HIGH_RISK', approval:'explicit', inputSchema:z.object({table:QualifiedTable,columns:z.array(z.object({name:Identifier,type:z.string().regex(/^[A-Za-z0-9_(), ']+$/).max(200)}).strict()).min(1).max(100),orderBy:z.array(Identifier).min(1).max(10),approved:z.boolean()}).strict(), run:async(i)=>{ const x=z.object({table:QualifiedTable,columns:z.array(z.object({name:Identifier,type:z.string().regex(/^[A-Za-z0-9_(), ']+$/).max(200)}).strict()).min(1).max(100),orderBy:z.array(Identifier).min(1).max(10),approved:z.boolean()}).strict().parse(i); requireHighRisk(x); const cols=x.columns.map(c=>`${quoteIdentifier(c.name)} ${c.type}`).join(', '); const order=x.orderBy.map(quoteIdentifier).join(', '); await client.exec(`CREATE TABLE ${quoteQualifiedTable(x.table,config.database)} (${cols}) ENGINE = MergeTree ORDER BY (${order})`); return {created:x.table}; } },
    { name:'clickhouse.table.truncate', description:'Remove all rows from a table.', risk:'DESTRUCTIVE', approval:'explicit', inputSchema:Table.merge(Approval), run:async(i)=>{ const x=Table.merge(Approval).parse(i); requireDestructive(config,x); await client.exec(`TRUNCATE TABLE ${quoteQualifiedTable(x.table,config.database)}`); return {truncated:x.table}; } },
    { name:'clickhouse.table.drop', description:'Drop a table.', risk:'DESTRUCTIVE', approval:'explicit', inputSchema:Table.merge(Approval), run:async(i)=>{ const x=Table.merge(Approval).parse(i); requireDestructive(config,x); await client.exec(`DROP TABLE ${quoteQualifiedTable(x.table,config.database)}`); return {dropped:x.table}; } }
  ];
}
