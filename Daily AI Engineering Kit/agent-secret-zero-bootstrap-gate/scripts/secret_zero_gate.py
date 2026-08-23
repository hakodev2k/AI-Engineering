#!/usr/bin/env python3
import argparse, fnmatch, json, re, subprocess, sys
from pathlib import Path

TEXT_EXT={'.json','.yaml','.yml','.toml','.ini','.config','.xml','.cs','.py','.js','.ts','.sh','.ps1','.md','.txt','.properties'}
SKIP={'.git','bin','obj','node_modules','.venv','venv','dist','build'}

def tracked(root):
    try:
        out=subprocess.check_output(['git','-C',str(root),'ls-files'],text=True,stderr=subprocess.DEVNULL)
        return [root/p for p in out.splitlines() if p]
    except Exception:
        return [p for p in root.rglob('*') if p.is_file() and not any(x in SKIP for x in p.parts)]

def main():
    ap=argparse.ArgumentParser(description='Detect static secret-zero bootstrap risks without printing secret values.')
    ap.add_argument('--root',default='.')
    ap.add_argument('--policy',default='config/policy.json')
    ap.add_argument('--environment',choices=['local','ci','staging','production'],default='local')
    ap.add_argument('--output')
    a=ap.parse_args(); root=Path(a.root).resolve(); policy_path=Path(a.policy)
    if not policy_path.is_absolute(): policy_path=(Path.cwd()/policy_path).resolve()
    if not root.is_dir() or not policy_path.is_file(): print('invalid root or policy',file=sys.stderr); return 3
    policy=json.loads(policy_path.read_text(encoding='utf-8'))
    names=[x.lower() for x in policy['forbidden_secret_name_patterns']]
    filep=policy['forbidden_file_patterns']; findings=[]
    assign=re.compile(r'(?i)(client[_-]?secret|api[_-]?key|password|private[_-]?key|access[_-]?token|refresh[_-]?token)\s*[=:]\s*["\']?([^\s"\']+)')
    for p in tracked(root):
        try: rel=p.relative_to(root).as_posix()
        except ValueError: continue
        if any(fnmatch.fnmatch(p.name,pat) or fnmatch.fnmatch(rel,pat) for pat in filep):
            findings.append({'file':rel,'line':None,'rule':'forbidden_credential_file','evidence':'path-only'})
        if p.suffix.lower() not in TEXT_EXT or p.stat().st_size>2_000_000: continue
        try: lines=p.read_text(encoding='utf-8',errors='replace').splitlines()
        except OSError: continue
        for i,line in enumerate(lines,1):
            m=assign.search(line)
            if m and m.group(2).lower() not in {'${secret}','${token}','<redacted>','changeme','example','placeholder'}:
                findings.append({'file':rel,'line':i,'rule':'static_secret_assignment','evidence':m.group(1).lower()+'=<redacted>'})
    blocking=bool(findings) and (a.environment=='production' or policy.get('production_forbids_static_bootstrap_secrets',True))
    result={'status':'blocked' if blocking else ('review' if findings else 'pass'),'environment':a.environment,'finding_count':len(findings),'findings':findings}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text); return 2 if blocking else 0
if __name__=='__main__': sys.exit(main())
