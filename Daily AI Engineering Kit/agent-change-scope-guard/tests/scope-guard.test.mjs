import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const script=resolve('scripts/scope-guard.mjs');
function git(c,...args){return execFileSync('git',args,{cwd:c,encoding:'utf8'});}
function fixture(fn){
 const dir=mkdtempSync(join(tmpdir(),'scope-guard-'));
 try{
 git(dir,'init','-q');git(dir,'config','user.email','test@example.invalid');git(dir,'config','user.name','Test');
 mkdirSync(join(dir,'src'));writeFileSync(join(dir,'src','a.txt'),'base\n');
 git(dir,'add','.');git(dir,'commit','-qm','base');
 const policy={version:1,allowed:['src/**'],blocked:['**/.env','**/migrations/**'],maxChangedFiles:2,maxAddedLines:10,maxDeletedLines:10,requireCleanBaseline:true};
 writeFileSync(join(dir,'policy.json'),JSON.stringify(policy));
 fn(dir);
 }finally{rmSync(dir,{recursive:true,force:true});}
}
function run(dir,mode='working'){const r=spawnSync(process.execPath,[script,'--policy','policy.json','--report','result.json','--mode',mode],{cwd:dir,encoding:'utf8'});return {status:r.status,report:JSON.parse(readFileSync(join(dir,'result.json'),'utf8'))};}
test('allowed change passes',()=>fixture(d=>{writeFileSync(join(d,'src','a.txt'),'updated\n');assert.equal(run(d).status,0);}));
test('blocked migration fails',()=>fixture(d=>{mkdirSync(join(d,'src','migrations'));writeFileSync(join(d,'src','migrations','a.sql'),'select 1;\n');git(d,'add','.');const r=run(d,'staged');assert.equal(r.status,2);assert.equal(r.report.errors.includes('path-policy'),true);}));
test('outside allowlist fails',()=>fixture(d=>{writeFileSync(join(d,'other.txt'),'x\n');git(d,'add','.');assert.equal(run(d,'staged').status,2);}));
test('line limit fails',()=>fixture(d=>{writeFileSync(join(d,'src','a.txt'),Array(20).fill('new').join('\n'));assert.equal(run(d).status,2);}));
