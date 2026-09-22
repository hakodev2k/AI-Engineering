export type Risk='READ'|'WRITE'|'HIGH_RISK'|'DESTRUCTIVE';
export class ApprovalError extends Error {}
export function requireApproval(risk:Risk, approved:boolean){
  const configured=(process.env.RESEND_REQUIRE_WRITE_APPROVAL??'true')!=='false';
  if(risk!=='READ' && configured && !approved) throw new ApprovalError(`Human approval required for ${risk} operation`);
}
export function config(){
  const apiKey=process.env.RESEND_API_KEY;
  if(!apiKey) throw new Error('RESEND_API_KEY is required');
  return {apiKey,timeout:Number(process.env.RESEND_TIMEOUT_MS??15000),maxRetries:Math.min(4,Math.max(0,Number(process.env.RESEND_MAX_RETRIES??2)))};
}
