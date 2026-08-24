import crypto from 'node:crypto';

export type Risk = 'READ' | 'WRITE' | 'HIGH_RISK' | 'DESTRUCTIVE';

export const TOOL_RISK: Record<string, Risk> = {
  'aws.identity.get': 'READ',
  'aws.s3.bucket.list': 'READ',
  'aws.s3.object.list': 'READ',
  'aws.s3.object.metadata': 'READ',
  'aws.s3.object.presign_get': 'HIGH_RISK',
  'aws.ec2.instance.list': 'READ',
  'aws.ec2.instance.start': 'HIGH_RISK',
  'aws.ec2.instance.stop': 'HIGH_RISK',
  'aws.lambda.function.list': 'READ',
  'aws.lambda.function.get': 'READ',
  'aws.cloudwatch.metric.get': 'READ',
  'aws.logs.filter': 'READ'
};

export function approvalDigest(secret: string, tool: string) {
  return crypto.createHmac('sha256', secret).update(tool).digest('hex');
}

export function assertApproval(tool: string, approvalId: string | undefined, secret: string | undefined) {
  if (!secret) throw new Error(`Approval secret is not configured; ${tool} is disabled`);
  if (!approvalId) throw new Error(`Explicit approval is required for ${tool}`);
  const expected = approvalDigest(secret, tool);
  const actual = Buffer.from(approvalId);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !crypto.timingSafeEqual(actual, wanted)) throw new Error(`Invalid approval token for ${tool}`);
}
