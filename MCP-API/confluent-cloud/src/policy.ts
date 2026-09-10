import crypto from 'node:crypto';
import type { Config } from './config.js';

export type Risk = 'READ' | 'HIGH_RISK';
export type Scope = 'global' | 'regional';
export type Binding = { external: string; upstream: string; scope: Scope; risk: Risk; description: string };

export const BINDINGS: Binding[] = [
  ['confluent.environment.list','list_environments','global','READ','List accessible Confluent Cloud environments'],
  ['confluent.environment.get','read_environment','global','READ','Read one environment'],
  ['confluent.cluster.list','list_clusters','global','READ','List Kafka clusters in an environment'],
  ['confluent.cluster.get','read_cluster','global','READ','Read one Kafka cluster'],
  ['confluent.connector.list','list_connectors','global','READ','List managed connectors'],
  ['confluent.connector.config.get','get_connector_config','global','READ','Read connector configuration'],
  ['confluent.connector.status.get','get_connector_status','global','READ','Read connector and task status'],
  ['confluent.connector.logs.get','get_connector_logs','global','READ','Read recent connector logs'],
  ['confluent.connector.offsets.get','get_connector_offsets','global','READ','Read connector offsets'],
  ['confluent.connector.metrics.get','get_connector_metrics','global','READ','Read connector metrics'],
  ['confluent.connector.error_summary.get','get_connector_error_summary','global','READ','Get provider-generated connector error summary'],
  ['confluent.connector.restart','restart_connector','global','HIGH_RISK','Restart a connector and its tasks'],
  ['confluent.connector.config.update','update_connector_config','global','HIGH_RISK','Update connector configuration'],
  ['confluent.metric.list','list_metrics','global','READ','List metric descriptors'],
  ['confluent.metric.query','query_metrics','global','READ','Query time-series metrics'],
  ['confluent.topic.list','list_kafka_topics','regional','READ','List Kafka topics'],
  ['confluent.topic.describe','describe_kafka_topic','regional','READ','Describe Kafka topic configuration'],
  ['confluent.topic.message.sample','consume_kafka_messages','regional','READ','Read one to ten sample Kafka messages'],
  ['confluent.schema.subject.list','list_schema_subjects','regional','READ','List Schema Registry subjects'],
  ['confluent.schema.subject.get','read_schema_subject','regional','READ','Read one schema subject']
].map(([external,upstream,scope,risk,description]) => ({ external, upstream, scope: scope as Scope, risk: risk as Risk, description }));

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}

export function approvalFor(secret: string, tool: string, args: Record<string,unknown>): string {
  const clean = { ...args }; delete clean.approval_token;
  return crypto.createHmac('sha256', secret).update(`${tool}\n${canonical(clean)}`).digest('hex');
}

export function enforce(binding: Binding, args: Record<string,unknown>, config: Config): Record<string,unknown> {
  if (binding.risk === 'READ') return args;
  if (!config.enableWrites) throw new Error(`${binding.external} is disabled; operator must set CONFLUENT_ENABLE_WRITES=true`);
  if (!config.approvalSecret) throw new Error('CONFLUENT_APPROVAL_SECRET is required for high-risk tools');
  const provided = typeof args.approval_token === 'string' ? args.approval_token : '';
  const expected = approvalFor(config.approvalSecret, binding.external, args);
  const a = Buffer.from(provided); const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a,b)) throw new Error(`Explicit approval required for ${binding.external}`);
  const clean = { ...args }; delete clean.approval_token;
  return clean;
}

export function augmentSchema(schema: Record<string,unknown>, binding: Binding): Record<string,unknown> {
  const copy = structuredClone(schema);
  copy.type = 'object';
  const props = (copy.properties && typeof copy.properties === 'object') ? copy.properties as Record<string,unknown> : {};
  copy.properties = props;
  copy.additionalProperties = false;
  if (binding.risk !== 'READ') {
    props.approval_token = { type: 'string', minLength: 64, maxLength: 64, pattern: '^[a-f0-9]{64}$', description: 'Human approval HMAC bound to this exact tool and payload.' };
    const required = Array.isArray(copy.required) ? [...copy.required as string[]] : [];
    if (!required.includes('approval_token')) required.push('approval_token');
    copy.required = required;
  }
  return copy;
}
