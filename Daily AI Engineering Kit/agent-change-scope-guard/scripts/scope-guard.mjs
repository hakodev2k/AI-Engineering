#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const args=process.argv.slice(2);
function option(name,defaultValue){const i=args.indexOf(name);return i<0?defaultValue:args[i+1];}
const policyPath=option('--policy','config/policy.json');
const reportPath=option('--report','artifacts/scope-report.json');
const baseline=option('--base','HEAD');
const mode=option('--mode','working');
function git(...a){return execFileSync('git',a,{encoding:'utf8',maxBuffer:16*1024*1024}).trimEnd();}
function glob(pattern,path){const escaped=pattern.split('**').map(s=>s.replace(/[.+^$()|[\]{}]/g,'\\$&').replace(/\*/g,'[^/]*').replace(/\?/g,'[^/]')).join('.*');return new RegExp('^'+escaped+'$').test(path);}
function matches(pattern,path){return glob(pattern,path)||pattern.startsWith('**/')&&glob(pattern.slice(3),path);}
function main(){
if(!['working','staged','commit'].includes(mode))throw Error('Invalid --mode');
const policy=JSON.parse(readFileSync(policyPath,'utf8'));
for(const k of ['allowed','blocked'])if(!Array.isArray(policy[k])||!policy[k].every(x=>typeof x==='string'))throw Error('Invalid '+k);
for(const k of ['maxChangedFiles','maxAddedLines','maxDeletedLines'])if(!Number.isInteger(policy[k])||policy[k]<0)throw Error('Invalid '+k);
git('rev-parse','--show-toplevel');git('rev-parse','--verify',baseline+'^{commit}');
const initial=git('status','--porcelain=v1','-z').split('\0').filter(Boolean);
const dirty=initial.length>0;
const diffArgs=mode==='working'?['diff','--no-ext-diff','--numstat','-z',baseline,'--']:mode==='staged'?['diff','--cached','--no-ext-diff','--numstat','-z',baseline,'--']:['diff','--no-ext-diff','--numstat','-z',baseline,'HEAD','--'];
const raw=git(...diffArgs).split('\0').filter(Boolean);
const files=[];let added=0,deleted=0;
for(let i=0;i<raw.length;){
 const entry=raw[i++];const m=entry.match(/^(\d+|-)\t(\d+|-)\t(.*)$/);
 if(!m)throw Error('Unexpected numstat entry');
 let path=m[3];if(!path){i++;path=raw[i++];}
 if(!path)throw Error('Missing path');
 const a=m[1]==='-'?0:Number(m[1]),d=m[2]==='-'?0:Number(m[2]);
 added+=a;deleted+=d;
 const reasons=[];
 if(!policy.allowed.some(p=>matches(p,path)))reasons.push('outside-allowlist');
 if(policy.blocked.some(p=>matches(p,path)))reasons.push('blocked-path');
 if(m[1]==='-'||m[2]==='-')reasons.push('binary-change-review');
 files.push({path,added:a,deleted:d,reasons});
}
const errors=[];
if(files.length>policy.maxChangedFiles)errors.push('file-limit');
if(added>policy.maxAddedLines)errors.push('added-line-limit');
if(deleted>policy.maxDeletedLines)errors.push('deleted-line-limit');
if(policy.requireCleanBaseline&&mode==='commit'&&dirty)errors.push('dirty-worktree');
if(files.some(f=>f.reasons.length))errors.push('path-policy');
const report={schemaVersion:1,mode,baseline,pass:errors.length===0,errors,totals:{files:files.length,added,deleted},files};
mkdirSync(dirname(resolve(reportPath)),{recursive:true});writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,errors:report.errors,report:reportPath}));
process.exitCode=report.pass?0:2;
}
try{main()}catch(e){console.error(e.message);process.exitCode=3;}
