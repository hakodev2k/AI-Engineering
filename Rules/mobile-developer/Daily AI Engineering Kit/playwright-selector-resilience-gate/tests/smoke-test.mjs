#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const policy=path.join(root,'config','selector-policy.json');
const scripts=path.join(root,'scripts');
function run(script,args,expected=0){
  const r=spawnSync(process.execPath,[path.join(scripts,script),...args],{encoding:'utf8'});
  if(r.status!==expected) throw new Error(`${script} exit ${r.status}, expected ${expected}\nstdout=${r.stdout}\nstderr=${r.stderr}`);
  return r;
}
function write(p,obj){fs.writeFileSync(p,JSON.stringify(obj,null,2)+'\n');}
function inv(selector){return {version:'1.0.0',generated_at:new Date().toISOString(),repository_revision:'abc123',selectors:[selector]};}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'selector-gate-'));
try{
  const low=path.join(tmp,'low.json'), lowEval=path.join(tmp,'low-eval.json'), lowGate=path.join(tmp,'low-gate.json');
  write(low,inv({id:'s1',file:'tests/a.spec.ts',line:1,kind:'getByRole',expression:"getByRole('button',{name:'Save'})",risk:'low',score:0,evidence:['preferred-semantic-kind'],runtime_probe:null}));
  run('validate-selector-inventory.mjs',['--inventory',low,'--output',path.join(tmp,'low-validation.json')]);
  run('evaluate-selector-resilience.mjs',['--inventory',low,'--policy',policy,'--output',lowEval]);
  run('evaluate-selector-gate.mjs',['--evaluation',lowEval,'--policy',policy,'--implementation-owner','impl','--output',lowGate]);
  if(JSON.parse(fs.readFileSync(lowGate,'utf8')).status!=='verified') throw new Error('low-risk case not verified');

  const missingProbe=path.join(tmp,'missing-probe.json'), missingProbeEval=path.join(tmp,'missing-probe-eval.json');
  write(missingProbe,inv({id:'s-missing',file:'tests/missing.spec.ts',line:2,kind:'locator-xpath',expression:"locator('//button[@type=\"submit\"]')",risk:'high',score:4,evidence:['xpath-structure-coupled'],runtime_probe:null}));
  run('evaluate-selector-resilience.mjs',['--inventory',missingProbe,'--policy',policy,'--output',missingProbeEval],1);
  if(JSON.parse(fs.readFileSync(missingProbeEval,'utf8')).status!=='blocked') throw new Error('required runtime probe absence did not block');

  const high=path.join(tmp,'high.json'), highEval=path.join(tmp,'high-eval.json');
  write(high,inv({id:'s2',file:'tests/b.spec.ts',line:2,kind:'locator-xpath',expression:"locator('//button[@type=\"submit\"]')",risk:'high',score:4,evidence:['xpath-structure-coupled'],runtime_probe:{status:'passed',match_count:1,visible_count:1,url:'http://example.invalid',observed_at:new Date().toISOString(),error:null}}));
  run('evaluate-selector-resilience.mjs',['--inventory',high,'--policy',policy,'--output',highEval]);
  const he=JSON.parse(fs.readFileSync(highEval,'utf8'));
  if(he.status!=='review-required') throw new Error(`expected review-required, got ${he.status}`);
  const review=path.join(tmp,'review.json');
  write(review,{version:'1.0.0',repository_revision:he.repository_revision,inventory_fingerprint:he.inventory_fingerprint,reviewer:'independent-reviewer',status:'approved',findings:[]});
  const highGate=path.join(tmp,'high-gate.json');
  run('evaluate-selector-gate.mjs',['--evaluation',highEval,'--policy',policy,'--review',review,'--implementation-owner','impl','--output',highGate]);
  if(JSON.parse(fs.readFileSync(highGate,'utf8')).status!=='verified') throw new Error('approved independent review did not verify');

  const selfReview=path.join(tmp,'self-review.json');
  write(selfReview,{version:'1.0.0',repository_revision:he.repository_revision,inventory_fingerprint:he.inventory_fingerprint,reviewer:'impl',status:'approved',findings:[]});
  run('evaluate-selector-gate.mjs',['--evaluation',highEval,'--policy',policy,'--review',selfReview,'--implementation-owner','impl','--output',path.join(tmp,'self-gate.json')],1);

  const changedPolicy=path.join(tmp,'changed-policy.json');
  const cp=JSON.parse(fs.readFileSync(policy,'utf8')); cp.thresholds.review_required_score=5; write(changedPolicy,cp);
  run('evaluate-selector-gate.mjs',['--evaluation',highEval,'--policy',changedPolicy,'--review',review,'--implementation-owner','impl','--output',path.join(tmp,'policy-mismatch-gate.json')],1);

  const dup=path.join(tmp,'dup.json'), dupEval=path.join(tmp,'dup-eval.json');
  write(dup,inv({id:'s3',file:'tests/c.spec.ts',line:3,kind:'locator-css',expression:"locator('.toolbar > div > div > button:nth-child(2)')",risk:'critical',score:8,evidence:['css-structure-coupled','fragile-pattern:nth-child'],runtime_probe:{status:'passed',match_count:2,visible_count:2,url:'http://example.invalid',observed_at:new Date().toISOString(),error:null}}));
  run('evaluate-selector-resilience.mjs',['--inventory',dup,'--policy',policy,'--output',dupEval],1);
  const de=JSON.parse(fs.readFileSync(dupEval,'utf8'));
  if(de.status!=='blocked') throw new Error('duplicate/positional case not blocked');

  const repo=path.join(tmp,'repo'); fs.mkdirSync(path.join(repo,'tests'),{recursive:true});
  fs.writeFileSync(path.join(repo,'tests','sample.spec.ts'),"const a = page.getByRole('button', { name: 'Save' });\nconst b = page.locator('.a > .b > .c > button:nth-child(2)');\n");
  const scan=path.join(tmp,'scan.json');
  run('scan-playwright-selectors.mjs',['--repo',repo,'--policy',policy,'--output',scan]);
  const scanned=JSON.parse(fs.readFileSync(scan,'utf8'));
  if(scanned.selectors.length!==2) throw new Error(`scanner expected 2 selectors, got ${scanned.selectors.length}`);
  if(!scanned.selectors.some(x=>x.risk==='critical')) throw new Error('scanner did not classify positional selector as critical');

  console.log('smoke-test: PASS');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
