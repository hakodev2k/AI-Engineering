import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { AwsSdkTransport } from './aws.js';
import { assertBucketAllowed, assertFunctionAllowed, assertRegionAllowed, loadConfig } from './config.js';
import { AwsManagedMcpTransport, preferMcp } from './mcp.js';
import { assertApproval } from './policy.js';

const config = loadConfig();
const sdk = new AwsSdkTransport(config);
const mcp = new AwsManagedMcpTransport(config);
const server = new McpServer({ name: 'aws-mcp-connector', version: '1.0.0' });
const region = z.string().min(3).max(32).regex(/^[a-z0-9-]+$/).optional();
const approvalId = z.string().length(64).optional();
const out = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value) }] });
const targetRegion = (r?: string) => { const x = r ?? config.region; assertRegionAllowed(config, x); return x; };
const py = (v: unknown) => JSON.stringify(v);
const script = (body: string) => `import boto3, json\n${body}`;

server.tool('aws.identity.get', 'Return the current AWS account and principal identity. READ.', { region }, async a => {
  const r = targetRegion(a.region);
  return out(await preferMcp(mcp, script(`print(json.dumps(boto3.client('sts', region_name=${py(r)}).get_caller_identity(), default=str))`), () => sdk.identity(r)));
});

server.tool('aws.s3.bucket.list', 'List S3 buckets visible to the current identity. READ.', { region }, async a => {
  const r = targetRegion(a.region);
  const result = await preferMcp(mcp, script(`print(json.dumps(boto3.client('s3', region_name=${py(r)}).list_buckets(), default=str))`), () => sdk.listBuckets(r));
  if (!config.allowedBuckets.size) return out(result);
  const obj: any = result as any;
  if (Array.isArray(obj?.Buckets)) obj.Buckets = obj.Buckets.filter((b: any) => config.allowedBuckets.has(b.Name));
  return out(obj);
});

server.tool('aws.s3.object.list', 'List objects in an allowed S3 bucket. READ.', {
  region, bucket: z.string().min(3).max(63), prefix: z.string().max(1024).optional(), continuationToken: z.string().max(4096).optional(), maxKeys: z.number().int().min(1).max(1000).optional()
}, async a => {
  const r = targetRegion(a.region); assertBucketAllowed(config, a.bucket);
  return out(await sdk.listObjects(r, a.bucket, a.prefix, a.continuationToken, a.maxKeys ?? 100));
});

server.tool('aws.s3.object.metadata', 'Read S3 object metadata without downloading object content. READ.', {
  region, bucket: z.string().min(3).max(63), key: z.string().min(1).max(1024)
}, async a => {
  const r = targetRegion(a.region); assertBucketAllowed(config, a.bucket);
  return out(await sdk.objectMetadata(r, a.bucket, a.key));
});

server.tool('aws.s3.object.presign_get', 'Create a temporary S3 download URL. HIGH_RISK because the URL grants data access; explicit approval required.', {
  region, bucket: z.string().min(3).max(63), key: z.string().min(1).max(1024), expiresInSeconds: z.number().int().min(60).max(3600).optional(), approvalId
}, async a => {
  const r = targetRegion(a.region); assertBucketAllowed(config, a.bucket); assertApproval('aws.s3.object.presign_get', a.approvalId, config.approvalSecret);
  return out(await sdk.presignGet(r, a.bucket, a.key, a.expiresInSeconds ?? 900));
});

server.tool('aws.ec2.instance.list', 'List EC2 instances and their current state. READ.', {
  region, instanceIds: z.array(z.string().regex(/^i-[a-f0-9]+$/)).max(100).optional(), nextToken: z.string().max(4096).optional(), maxResults: z.number().int().min(5).max(1000).optional()
}, async a => {
  const r = targetRegion(a.region);
  const ids = a.instanceIds;
  if (a.nextToken || a.maxResults || ids?.length) return out(await sdk.listInstances(r, a.nextToken, a.maxResults ?? 50, ids));
  return out(await preferMcp(mcp, script(`print(json.dumps(boto3.client('ec2', region_name=${py(r)}).describe_instances(MaxResults=50), default=str))`), () => sdk.listInstances(r, undefined, 50)));
});

server.tool('aws.ec2.instance.start', 'Start one or more EC2 instances. HIGH_RISK; explicit approval required.', {
  region, instanceIds: z.array(z.string().regex(/^i-[a-f0-9]+$/)).min(1).max(20), approvalId
}, async a => {
  const r = targetRegion(a.region); assertApproval('aws.ec2.instance.start', a.approvalId, config.approvalSecret);
  return out(await preferMcp(mcp, script(`print(json.dumps(boto3.client('ec2', region_name=${py(r)}).start_instances(InstanceIds=${py(a.instanceIds)}), default=str))`), () => sdk.startInstances(r, a.instanceIds)));
});

server.tool('aws.ec2.instance.stop', 'Stop one or more EC2 instances. HIGH_RISK; explicit approval required.', {
  region, instanceIds: z.array(z.string().regex(/^i-[a-f0-9]+$/)).min(1).max(20), hibernate: z.boolean().optional(), approvalId
}, async a => {
  const r = targetRegion(a.region); assertApproval('aws.ec2.instance.stop', a.approvalId, config.approvalSecret);
  const h = a.hibernate ?? false;
  return out(await preferMcp(mcp, script(`print(json.dumps(boto3.client('ec2', region_name=${py(r)}).stop_instances(InstanceIds=${py(a.instanceIds)}, Hibernate=${h ? 'True' : 'False'}), default=str))`), () => sdk.stopInstances(r, a.instanceIds, h)));
});

server.tool('aws.lambda.function.list', 'List Lambda functions. READ.', {
  region, marker: z.string().max(4096).optional(), maxItems: z.number().int().min(1).max(10000).optional()
}, async a => {
  const r = targetRegion(a.region);
  if (a.marker || a.maxItems) return out(await sdk.listFunctions(r, a.marker, a.maxItems ?? 50));
  return out(await preferMcp(mcp, script(`print(json.dumps(boto3.client('lambda', region_name=${py(r)}).list_functions(MaxItems=50), default=str))`), () => sdk.listFunctions(r, undefined, 50)));
});

server.tool('aws.lambda.function.get', 'Get Lambda configuration and code metadata; temporary code download URL is removed. READ.', {
  region, functionName: z.string().min(1).max(140), qualifier: z.string().max(128).optional()
}, async a => {
  const r = targetRegion(a.region); assertFunctionAllowed(config, a.functionName);
  return out(await sdk.getFunction(r, a.functionName, a.qualifier));
});

server.tool('aws.cloudwatch.metric.get', 'Query CloudWatch metric data. READ. Up to 20 metric queries per call.', {
  region,
  startTime: z.string().datetime(), endTime: z.string().datetime(), nextToken: z.string().max(4096).optional(),
  queries: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9_]{0,254}$/), namespace: z.string().min(1).max(255), metricName: z.string().min(1).max(255),
    dimensions: z.array(z.object({ name: z.string().min(1).max(255), value: z.string().max(1024) })).max(30).optional(),
    stat: z.string().min(1).max(100), period: z.number().int().min(1).max(86400)
  })).min(1).max(20)
}, async a => {
  const r = targetRegion(a.region); const start = new Date(a.startTime); const end = new Date(a.endTime);
  if (start >= end) throw new Error('startTime must be before endTime');
  return out(await sdk.metricData(r, a.queries, start, end, a.nextToken));
});

server.tool('aws.logs.filter', 'Filter CloudWatch Logs events in one log group. READ. Result size is bounded by limit.', {
  region, logGroupName: z.string().min(1).max(512), startTimeMs: z.number().int().nonnegative().optional(), endTimeMs: z.number().int().nonnegative().optional(),
  filterPattern: z.string().max(1024).optional(), nextToken: z.string().max(4096).optional(), limit: z.number().int().min(1).max(1000).optional()
}, async a => {
  const r = targetRegion(a.region);
  if (a.startTimeMs !== undefined && a.endTimeMs !== undefined && a.startTimeMs > a.endTimeMs) throw new Error('startTimeMs must not exceed endTimeMs');
  return out(await sdk.filterLogs(r, a.logGroupName, a.startTimeMs, a.endTimeMs, a.filterPattern, a.nextToken, a.limit ?? 100));
});

const shutdown = () => { void server.close().then(() => process.exit(0), () => process.exit(1)); };
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
await server.connect(new StdioServerTransport());
