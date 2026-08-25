#!/usr/bin/env python3
import argparse, hashlib, json, subprocess, sys
from pathlib import Path

def sha256(p: Path) -> str:
    h=hashlib.sha256()
    with p.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024), b''):
            h.update(chunk)
    return h.hexdigest()

def files_under(p: Path):
    if p.is_file():
        return [p]
    return sorted(x for x in p.rglob('*') if x.is_file()) if p.is_dir() else []

def git_dirty(repo: Path):
    try:
        r=subprocess.run(['git','-C',str(repo),'status','--porcelain','--untracked-files=all'],capture_output=True,text=True,timeout=10)
        return [] if r.returncode else [x for x in r.stdout.splitlines() if x]
    except (OSError, subprocess.SubprocessError):
        return []

def load_plan(path):
    data=json.loads(Path(path).read_text(encoding='utf-8'))
    for k in ('source','destination','operation'):
        if not isinstance(data.get(k),str) or not data[k]:
            raise ValueError(f'missing {k}')
    return data

def inventory(root: Path):
    out={}
    for p in files_under(root):
        rel='.' if root.is_file() else str(p.relative_to(root))
        out[rel]={'size':p.stat().st_size,'sha256':sha256(p)}
    return out

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('mode',choices=['preflight','verify'])
    ap.add_argument('--plan',required=True)
    a=ap.parse_args()
    try:
        plan=load_plan(a.plan)
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 2
    src=Path(plan['source']).expanduser(); dst=Path(plan['destination']).expanduser(); findings=[]
    if not src.exists():
        print(json.dumps({'status':'block','findings':['source_missing']})); return 1
    try:
        src_res=src.resolve(strict=True); dst_res=dst.resolve(strict=False)
    except OSError as e:
        print(json.dumps({'status':'error','error':str(e)})); return 2
    if src_res==dst_res:
        findings.append('source_destination_same')
    for key,actual in (('expected_source_resolved',src_res),('expected_destination_resolved',dst_res)):
        expected_path=plan.get(key)
        if expected_path:
            try:
                expected_res=Path(expected_path).expanduser().resolve(strict=False)
            except OSError:
                findings.append(f'{key}_invalid'); continue
            if expected_res!=actual:
                findings.append(f'{key}_mismatch')
    expected=inventory(src)
    repo=Path(plan.get('repo_root','')).expanduser() if plan.get('repo_root') else None
    dirty=git_dirty(repo) if repo and repo.exists() else []
    if a.mode=='preflight':
        if dirty and not plan.get('allow_dirty_workspace',False): findings.append('dirty_workspace')
        result={'status':'pass' if not findings else 'block','source':str(src_res),'destination':str(dst_res),'operation':plan['operation'],'source_files':len(expected),'dirty_entries':len(dirty),'findings':findings}
    else:
        if not dst.exists(): findings.append('destination_missing'); actual={}
        else: actual=inventory(dst)
        for rel,meta in expected.items():
            if rel not in actual: findings.append(f'missing:{rel}')
            elif actual[rel]!=meta: findings.append(f'mismatch:{rel}')
        extras=sorted(set(actual)-set(expected))
        result={'status':'pass' if not findings else 'block','verified_files':len(expected)-sum(1 for x in findings if x.startswith(('missing:','mismatch:'))),'expected_files':len(expected),'extra_files':extras,'findings':findings}
    print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result['status']=='pass' else 1

if __name__=='__main__':
    sys.exit(main())