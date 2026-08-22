#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';

function arg(name, fallback=null){const i=process.argv.indexOf(name);return i>=0&&i+1<process.argv.length?process.argv[i+1]:fallback;}
function die(msg, code=2){console.error(msg);process.exit(code);}
const input=arg('--inventory');
const output=arg('--output','selector-validation.json');
if(!input||!fs.existsSync(input))die('Missing --inventory file');
let data;try{data=JSON.parse(fs.readFileSync(input,'utf8'));}catch(e){die(`Invalid JSON: ${e.message}`);}
const findings=[];
for(const k of ['version','generated_at','repository_revision','selectors']) if(!(k in data)) findings.push({severity:'critical',code:'missing-field',message:`Missing ${k}`});
if(!Array.isArray(data.selectors)) findings.push({severity:'critical',code:'invalid-selectors',message:'selectors must be an array'});
else {
  const ids=new Set();
  for(const [i,s] of data.selectors.entries()){
    for(const k of ['id','file','line','kind','expression','risk','score','evidence']) if(!(k in s)) findings.push({severity:'critical',code:'missing-selector-field',message:`selectors[${i}] missing ${k}`});
    if(s.id){if(ids.has(s.id)) findings.push({severity:'critical',code:'duplicate-id',message:`Duplicate selector id ${s.id}`}); ids.add(s.id);}
    if(!['low','medium','high','critical'].includes(s.risk)) findings.push({severity:'critical',code:'invalid-risk',message:`Invalid risk for ${s.id||i}`});
    if(!Number.isInteger(s.line)||s.line<1) findings.push({severity:'critical',code:'invalid-line',message:`Invalid line for ${s.id||i}`});
    if(!Number.isInteger(s.score)||s.score<0) findings.push({severity:'critical',code:'invalid-score',message:`Invalid score for ${s.id||i}`});
    if(!Array.isArray(s.evidence)) findings.push({severity:'critical',code:'invalid-evidence',message:`Evidence must be array for ${s.id||i}`});
  }
}
const canonical=JSON.stringify(data);
const inventory_fingerprint=crypto.createHash('sha256').update(canonical).digest('hex');
const status=findings.some(x=>x.severity==='critical')?'blocked':'verified';
const result={status,inventory_fingerprint,findings};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
process.exit(status==='verified'?0:1);
