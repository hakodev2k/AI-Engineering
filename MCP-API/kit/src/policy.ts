export type Risk = 'READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export type Approval = { approved?: boolean; approvalToken?: string };

export const TOOL_POLICY: Record<string,{upstream:string;risk:Risk}> = {
  'kit.account.get': {upstream:'get_current_account',risk:'READ'},
  'kit.subscriber.list': {upstream:'list_subscribers',risk:'READ'},
  'kit.subscriber.get': {upstream:'get_subscriber',risk:'READ'},
  'kit.subscriber.create': {upstream:'create_subscriber',risk:'WRITE'},
  'kit.subscriber.update': {upstream:'update_subscriber',risk:'WRITE'},
  'kit.subscriber.tag': {upstream:'tag_subscriber',risk:'WRITE'},
  'kit.subscriber.unsubscribe': {upstream:'unsubscribe',risk:'DESTRUCTIVE'},
  'kit.tag.list': {upstream:'list_tags',risk:'READ'},
  'kit.sequence.list': {upstream:'list_sequences',risk:'READ'},
  'kit.broadcast.list': {upstream:'list_broadcasts',risk:'READ'},
  'kit.broadcast.get': {upstream:'get_broadcast',risk:'READ'},
  'kit.broadcast.stats': {upstream:'get_stats_for_a_broadcast',risk:'READ'},
  'kit.broadcast.create': {upstream:'create_broadcast',risk:'WRITE'},
  'kit.broadcast.update': {upstream:'update_broadcast',risk:'WRITE'},
  'kit.webhook.list': {upstream:'list_webhooks',risk:'READ'}
};

export function requireApproval(risk: Risk, approval: Approval = {}, mode=process.env.KIT_APPROVAL_MODE ?? 'required') {
  const required = risk==='HIGH_RISK'||risk==='DESTRUCTIVE'||(risk==='WRITE'&&mode==='required');
  if (required && (!approval.approved || !approval.approvalToken?.trim())) throw new Error(`APPROVAL_REQUIRED:${risk}`);
}
