#!/usr/bin/env python3
import argparse, fnmatch, hashlib, json, os, pathlib, re, sys
try:
    import yaml
except ImportError:
    yaml = None

def load(path):
    p=str(path)
    with open(path,encoding='utf-8') as f:
        if p.endswith('.json'): return json.load(f)
        if yaml is None: raise RuntimeError('PyYAML is required for YAML files: pip install pyyaml')
        return yaml.safe_load(f)

def flatten(v,p=''):
    out={}
    if isinstance(v,dict):
        for k,x in v.items(): out.update(flatten(x,f'{p}.{k}' if p else str(k)))
    elif isinstance(v,list): out[p]='list'
    else: out[p]=type(v).__name__
    return out

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--policy',default='config/policy.json'); ap.add_argument('--write-baseline',action='store_true'); ap.add_argument('--report',default='.ai-config-drift-report.json'); a=ap.parse_args()
    root=pathlib.Path(a.root).resolve(); policy_path=pathlib.Path(a.policy); policy_path=policy_path if policy_path.is_absolute() else pathlib.Path.cwd()/policy_path
    policy=json.loads(policy_path.read_text(encoding='utf-8')); base=root/policy['baseline_dir']; base.mkdir(exist_ok=True)
    files=[]
    for p in root.rglob('*'):
        if not p.is_file() or base in p.parents or '.git' in p.parts: continue
        rel=p.relative_to(root).as_posix()
        if any(fnmatch.fnmatch(rel,g) for g in policy['allowed_config_globs']): files.append((p,rel))
    findings=[]
    for p,rel in files:
        try: current=flatten(load(p) or {})
        except Exception as e: findings.append({'file':rel,'severity':'block','kind':'parse-error','detail':str(e)}); continue
        bp=base/(rel.replace('/','__')+'.schema.json')
        if a.write_baseline:
            bp.write_text(json.dumps({'source':rel,'sha256':digest(p),'keys':current},indent=2,sort_keys=True),encoding='utf-8'); continue
        if not bp.exists(): findings.append({'file':rel,'severity':'block','kind':'missing-baseline'}); continue
        old=json.loads(bp.read_text(encoding='utf-8')).get('keys',{}); removed=sorted(set(old)-set(current)); changed=sorted(k for k in set(old)&set(current) if old[k]!=current[k])
        if len(removed)>policy.get('max_removed_keys',0): findings.append({'file':rel,'severity':'block','kind':'removed-keys','keys':removed})
        if changed: findings.append({'file':rel,'severity':'block','kind':'type-changes','keys':changed})
        for key in current:
            if any(re.search(x,key,re.I) for x in policy.get('forbidden_key_patterns',[])): findings.append({'file':rel,'severity':'warn','kind':'sensitive-key-name','key':key})
    report={'status':'pass' if not any(x['severity']=='block' for x in findings) else 'block','files_checked':len(files),'findings':findings}
    pathlib.Path(a.report).write_text(json.dumps(report,indent=2),encoding='utf-8'); print(json.dumps(report,indent=2))
    return 0 if report['status']=='pass' else 2
if __name__=='__main__': sys.exit(main())
