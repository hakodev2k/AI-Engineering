#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

function arg(name,fallback=null){const i=process.argv.indexOf(name);return i>=0&&i+1<process.argv.length?process.argv[i+1]:fallback;}
function die(msg,code=2){console.error(msg);process.exit(code);}
const inventoryPath=arg('--inventory');
const policyPath=arg('--policy','config/selector-policy.json');
const output=arg('--output','selector-evaluation.json');
if(!inventoryPath||!fs.existsSync(inventoryPath))die('Missing --inventory');
if(!fs.existsSync(policyPath))die(`Policy not found: ${policyPath}`);
const inv=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
const policy=JSON.parse(fs.readFileSync(policyPath,'utf8'));
const findings=[];
let maxRisk='low';
const rank={low:0,medium:1,high:2,critical:3};
for(const s of inv.selectors||[]){
  let score=Number(s.score||0);
  const reasons=[...(s.evidence||[])];
  const needsProbe=(policy.risk.dynamic_probe_required_for||[]).includes(s.risk);
  const p=s.runtime_probe;
  if(needsProbe && (!p||p.status==='not-run')){score+=Number(policy.weights.missing_runtime_probe||0);reasons.push('runtime-probe-required');}
  if(p){
    if(p.status==='failed'){score+=Number(policy.weights.zero_runtime_match||0);reasons.push('runtime-probe-failed');}
    if(p.match_count===0){score+=Number(policy.weights.zero_runtime_match||0);reasons.push('zero-runtime-match');}
    if(p.match_count>Number(policy.risk.max_duplicate_matches||1)){score+=Number(policy.weights.duplicate_runtime_match||0);reasons.push(`duplicate-runtime-match:${p.match_count}`);}
    if(policy.risk.require_visible_match && p.status==='passed' && p.visible_count===0){score+=Number(policy.weights.zero_runtime_match||0);reasons.push('no-visible-runtime-match');}
  }
  let severity='low';
  if(score>=Number(policy.thresholds.blocked_score||8)) severity='critical';
  else if(score>=Number(policy.thresholds.review_required_score||4)) severity='high';
  else if(score>0) severity='medium';
  if(rank[severity]>rank[maxRisk])maxRisk=severity;
  if(severity!=='low')findings.push({selector_id:s.id,file:s.file,line:s.line,kind:s.kind,severity,score,reasons,recommendation:severity==='critical'?'replace or prove uniqueness/stability before relying on this selector':'review selector semantics and prefer stable user-facing or test-id contract'});
}
const canonical=JSON.stringify(inv);
const inventory_fingerprint=crypto.createHash('sha256').update(canonical).digest('hex');
const policy_fingerprint=crypto.createHash('sha256').update(JSON.stringify(policy)).digest('hex');
const blocked=findings.some(f=>f.severity==='critical');
const review=findings.some(f=>f.severity==='high');
const status=blocked?'blocked':review?'review-required':'verified';
const result={status,repository_revision:inv.repository_revision,inventory_fingerprint,policy_fingerprint,max_risk:maxRisk,findings};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
process.exit(status==='blocked'?1:0);
