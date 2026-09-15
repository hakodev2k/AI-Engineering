export const Risk = Object.freeze({ READ:'READ', WRITE:'WRITE', HIGH_RISK:'HIGH_RISK', DESTRUCTIVE:'DESTRUCTIVE' });

export function loadPolicy(env=process.env){
  const allowed=new Set((env.OPSGENIE_ALLOWED_RISKS||'READ').split(',').map(x=>x.trim()).filter(Boolean));
  return {allowed, highRiskEnabled: env.OPSGENIE_ENABLE_HIGH_RISK==='true'};
}

export function authorize(risk, approval, policy=loadPolicy()){
  if(!policy.allowed.has(risk)) throw new Error(`Permission denied: ${risk} is not enabled`);
  if(risk===Risk.DESTRUCTIVE) throw new Error('Destructive operations are disabled');
  if((risk===Risk.WRITE||risk===Risk.HIGH_RISK) && approval!==true) throw new Error(`Explicit approval is required for ${risk}`);
  if(risk===Risk.HIGH_RISK && !policy.highRiskEnabled) throw new Error('HIGH_RISK operations require OPSGENIE_ENABLE_HIGH_RISK=true');
}
