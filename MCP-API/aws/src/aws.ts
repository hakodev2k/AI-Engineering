import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { CloudWatchLogsClient, FilterLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { DescribeInstancesCommand, EC2Client, StartInstancesCommand, StopInstancesCommand } from '@aws-sdk/client-ec2';
import { GetFunctionCommand, LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { GetObjectCommand, HeadObjectCommand, ListBucketsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AwsConfig } from './config.js';

export class AwsSdkTransport {
  constructor(private readonly config: AwsConfig) {}

  private clients(region: string) {
    const common = { region, maxAttempts: 3 };
    return {
      sts: new STSClient(common), s3: new S3Client(common), ec2: new EC2Client(common), lambda: new LambdaClient(common),
      cloudwatch: new CloudWatchClient(common), logs: new CloudWatchLogsClient(common)
    };
  }

  async identity(region: string) {
    return this.clients(region).sts.send(new GetCallerIdentityCommand({}));
  }

  async listBuckets(region: string) {
    return this.clients(region).s3.send(new ListBucketsCommand({}));
  }

  async listObjects(region: string, bucket: string, prefix?: string, continuationToken?: string, maxKeys = 100) {
    return this.clients(region).s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken, MaxKeys: maxKeys }));
  }

  async objectMetadata(region: string, bucket: string, key: string) {
    return this.clients(region).s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  }

  async presignGet(region: string, bucket: string, key: string, expiresIn: number) {
    return { url: await getSignedUrl(this.clients(region).s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn }) };
  }

  async listInstances(region: string, nextToken?: string, maxResults = 50, instanceIds?: string[]) {
    return this.clients(region).ec2.send(new DescribeInstancesCommand({ NextToken: nextToken, MaxResults: instanceIds?.length ? undefined : maxResults, InstanceIds: instanceIds }));
  }

  async startInstances(region: string, instanceIds: string[]) {
    return this.clients(region).ec2.send(new StartInstancesCommand({ InstanceIds: instanceIds }));
  }

  async stopInstances(region: string, instanceIds: string[], hibernate = false) {
    return this.clients(region).ec2.send(new StopInstancesCommand({ InstanceIds: instanceIds, Hibernate: hibernate }));
  }

  async listFunctions(region: string, marker?: string, maxItems = 50) {
    return this.clients(region).lambda.send(new ListFunctionsCommand({ Marker: marker, MaxItems: maxItems }));
  }

  async getFunction(region: string, functionName: string, qualifier?: string) {
    const result = await this.clients(region).lambda.send(new GetFunctionCommand({ FunctionName: functionName, Qualifier: qualifier }));
    if (result.Code) result.Code.Location = undefined;
    return result;
  }

  async metricData(region: string, queries: Array<{ id: string; namespace: string; metricName: string; dimensions?: Array<{ name: string; value: string }>; stat: string; period: number }>, startTime: Date, endTime: Date, nextToken?: string) {
    return this.clients(region).cloudwatch.send(new GetMetricDataCommand({
      StartTime: startTime, EndTime: endTime, NextToken: nextToken,
      MetricDataQueries: queries.map(q => ({ Id: q.id, MetricStat: { Metric: { Namespace: q.namespace, MetricName: q.metricName, Dimensions: q.dimensions?.map(d => ({ Name: d.name, Value: d.value })) }, Period: q.period, Stat: q.stat }, ReturnData: true }))
    }));
  }

  async filterLogs(region: string, logGroupName: string, startTime?: number, endTime?: number, filterPattern?: string, nextToken?: string, limit = 100) {
    return this.clients(region).logs.send(new FilterLogEventsCommand({ logGroupName, startTime, endTime, filterPattern, nextToken, limit }));
  }
}
