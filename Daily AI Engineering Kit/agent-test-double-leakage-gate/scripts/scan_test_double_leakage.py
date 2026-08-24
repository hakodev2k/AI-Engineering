#!/usr/bin/env python3
from __future__ import annotations
import argparse,fnmatch,json,os,re,sys
from datetime import datetime,timezone
from pathlib import Path

def now(): return datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
def norm(s): return s.replace('\\','/').lstrip('./')
def load(p):
 try:return json.loads(p.read_text(encoding='utf-8'))
 except (OSError,json.JSONDecodeError) as e:raise ValueError(f'invalid JSON {p}: {e}')
def validate(p):
 if not isinstance(p,dict) or p.get('version')!=1: raise ValueError('policy version must be 1')
 for k in ('production_path_globs','test_path_globs','text_extensions'):
  if not isinstance(p.get(k),list): raise ValueError(f'{k} must be array')
 if not isinstance(p.get('max_file_bytes'),int) or p['max_file_bytes']<=0: raise ValueError('max_file_bytes invalid')
 q=dict(p)
 for group in ('filename_rules','content_rules'):
  out=[]
  for r in p.get(group,[]):
   if not all(isinstance(r.get(k),str) and r[k] for k in ('id','severity','pattern','message')): raise ValueError(f'invalid {group} rule')
   x=dict(r); x['_re']=re.compile(r['pattern']); out.append(x)
  q[group]=out
 for e in p.get('exceptions',[]):
  if not isinstance(e.get('path_glob'),str) or not isinstance(e.get('rule_ids'),list) or not e.get('reason'): raise ValueError('invalid exception')
 return q
def matches(path,patterns): return any(fnmatch.fnmatchcase(norm(path).lower(),norm(p).lower()) for p in patterns)
def prod(path,p): return matches(path,p['production_path_globs']) and not matches(path,p['test_path_globs'])
def excepted(path,rid,p): return any(rid in e['rule_ids'] and matches(path,[e['path_glob']]) for e in p.get('exceptions',[]))
def ev(s):
 s=re.sub(r'\s+',' ',s.strip()); return s if len(s)<=180 else s[:177]+'...'
def finding(r,path,line,text,p): return {'rule_id':r['id'],'severity':r['severity'],'path':path,'line':line,'evidence':ev(text),'message':r['message'],'excepted':excepted(path,r['id'],p)}
def files(root):
 ignore={'.git','.hg','.svn','node_modules','bin','obj','dist','build','.venv','venv','__pycache__'}
 for cur,dirs,names in os.walk(root):
  dirs[:]=[d for d in dirs if d not in ignore]
  for n in names: yield Path(cur)/n
def candidates(root,p,changed=None):
 out=[]
 if changed:
  try: rels=[norm(x.strip()) for x in changed.read_text(encoding='utf-8').splitlines() if x.strip()]
  except OSError as e: raise ValueError(f'cannot read changed list: {e}')
  for rel in dict.fromkeys(rels):
   full=(root/rel).resolve()
   try: full.relative_to(root.resolve())
   except ValueError: raise ValueError(f'path escapes root: {rel}')
   if full.is_file() and prod(rel,p): out.append((rel,full))
 else:
  for full in files(root):
   rel=norm(str(full.relative_to(root)))
   if prod(rel,p): out.append((rel,full))
 return out
def scan(rel,full,p):
 out=[]
 for r in p['filename_rules']:
  if r['_re'].search(Path(rel).name): out.append(finding(r,rel,None,Path(rel).name,p))
 if full.suffix.lower() not in {x.lower() for x in p['text_extensions']}: return out
 try:
  if full.stat().st_size>p['max_file_bytes']: return out
  text=full.read_text(encoding='utf-8')
 except (OSError,UnicodeDecodeError): return out
 lines=text.splitlines()
 for r in p['content_rules']:
  for m in r['_re'].finditer(text):
   line=text.count('\n',0,m.start())+1; txt=lines[line-1] if 0<line<=len(lines) else m.group(0); out.append(finding(r,rel,line,txt,p))
 return out
def report(root,p,changed=None):
 cs=candidates(root,p,changed); fs=[]
 for rel,full in cs: fs.extend(scan(rel,full,p))
 blockers=[x for x in fs if not x['excepted']]
 return {'status':'blocked' if blockers else 'clean','root':str(root.resolve()),'policy_version':p['version'],'scanned_files':len(cs),'blocking_findings':len(blockers),'findings':fs,'generated_at':now()}
def main():
 a=argparse.ArgumentParser(); a.add_argument('--root',type=Path,default=Path('.')); a.add_argument('--policy',type=Path,required=True); a.add_argument('--changed-files',type=Path); a.add_argument('--output',type=Path); x=a.parse_args()
 try:
  root=x.root.resolve()
  if not root.is_dir(): raise ValueError('root is not directory')
  r=report(root,validate(load(x.policy)),x.changed_files); text=json.dumps(r,indent=2,sort_keys=True); print(text)
  if x.output: x.output.parent.mkdir(parents=True,exist_ok=True); x.output.write_text(text+'\n',encoding='utf-8')
  return 2 if r['status']=='blocked' else 0
 except ValueError as e: print(json.dumps({'status':'invalid','root':str(x.root),'policy_version':None,'scanned_files':0,'blocking_findings':0,'findings':[],'generated_at':now(),'error':str(e)},indent=2)); return 4
 except Exception as e: print(json.dumps({'status':'error','root':str(x.root),'policy_version':None,'scanned_files':0,'blocking_findings':0,'findings':[],'generated_at':now(),'error':str(e)},indent=2)); return 5
if __name__=='__main__': sys.exit(main())