#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function die(message, code = 2) { console.error(message); process.exit(code); }
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined; }
function readJson(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { die(`Cannot read JSON ${file}: ${e.message}`); } }
function readJsonl(file) {
  let text; try { text = fs.readFileSync(file, 'utf8'); } catch (e) { die(`Cannot read samples ${file}: ${e.message}`); }
  const rows = [];
  for (const [idx, line] of text.split(/\r?\n/).entries()) { if (!line.trim()) continue; try { rows.push(JSON.parse(line)); } catch (e) { die(`Invalid JSONL line ${idx + 1}: ${e.message}`); } }
  return rows;
}
function validatePolicy(p) { for (const k of ['warmup_operations','sample_every_operations','max_retained_mb_per_1000_ops','max_total_post_gc_growth_mb','minimum_samples']) if (!Number.isFinite(p[k]) || p[k] < 0) die(`Invalid policy field: ${k}`); }
function linearSlope(points) {
  const n=points.length, sx=points.reduce((s,p)=>s+p.x,0), sy=points.reduce((s,p)=>s+p.y,0), sxx=points.reduce((s,p)=>s+p.x*p.x,0), sxy=points.reduce((s,p)=>s+p.x*p.y,0), d=n*sxx-sx*sx;
  return d ? (n*sxy-sx*sy)/d : 0;
}
function percentile(values,q){ if(!values.length)return null; const a=[...values].sort((x,y)=>x-y); return a[Math.min(a.length-1,Math.max(0,Math.ceil(q*a.length)-1))]; }
function analyze(samples, policy) {
  const valid=samples.filter(s=>Number.isFinite(s.op)&&Number.isFinite(s.heapUsed));
  const scored=valid.filter(s=>s.op>=policy.warmup_operations);
  if(scored.length<policy.minimum_samples) die(`Need at least ${policy.minimum_samples} post-warmup samples; got ${scored.length}`);
  const slope=linearSlope(scored.map(s=>({x:s.op,y:s.heapUsed})));
  const mbPer1000=slope*1000/1024/1024;
  const growth=(scored.at(-1).heapUsed-scored[0].heapUsed)/1024/1024;
  const elapsed=(scored.at(-1).elapsedMs??0)-(scored[0].elapsedMs??0), ops=scored.at(-1).op-scored[0].op;
  const failures=[];
  if(mbPer1000>policy.max_retained_mb_per_1000_ops) failures.push(`slope ${mbPer1000.toFixed(3)} MB/1k ops > ${policy.max_retained_mb_per_1000_ops}`);
  if(growth>policy.max_total_post_gc_growth_mb) failures.push(`total growth ${growth.toFixed(3)} MB > ${policy.max_total_post_gc_growth_mb}`);
  if(samples.some(s=>s.oom===true)&&policy.fail_on_oom!==false) failures.push('OOM/crash marker present');
  return {status:failures.length?'FAIL':'PASS',samples_total:valid.length,samples_scored:scored.length,first_scored_op:scored[0].op,last_scored_op:scored.at(-1).op,retained_mb_per_1000_ops:+mbPer1000.toFixed(4),total_post_gc_growth_mb:+growth.toFixed(4),throughput_ops_per_sec:elapsed>0?+(ops/(elapsed/1000)).toFixed(2):null,p95_latency_ms:percentile(scored.map(s=>s.latencyMs).filter(Number.isFinite),.95),failures};
}
function selfTest(policy){ if(policy.require_expose_gc&&typeof global.gc!=='function') die('Policy requires explicit GC. Run Node with --expose-gc.'); const plateau=Array.from({length:10},(_,i)=>({op:policy.warmup_operations+i*250,heapUsed:100000000+(i%2)*50000,elapsedMs:i*100,latencyMs:2})); const r=analyze(plateau,policy); if(r.status!=='PASS') die(`Self-test failed: ${JSON.stringify(r)}`); console.log(JSON.stringify({status:'PASS',gc_available:typeof global.gc==='function',policy_valid:true})); }
const policyFile=arg('--policy')??path.join('config','policy.json'); const policy=readJson(policyFile); validatePolicy(policy);
if(process.argv.includes('--self-test')) selfTest(policy); else { const samplesFile=arg('--samples'); if(!samplesFile) die('Usage: memory-slope-check.mjs --samples <jsonl> --policy <json> [--out <json>]'); const report=analyze(readJsonl(samplesFile),policy), out=arg('--out'), text=JSON.stringify(report,null,2)+'\n'; if(out){fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);} process.stdout.write(text); process.exit(report.status==='PASS'?0:1); }
