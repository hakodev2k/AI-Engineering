#!/usr/bin/env python3
import argparse, json, os, re, shlex, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'})); sys.exit(3)

def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def load_policy(path):
    return yaml.safe_load(Path(path).read_text(encoding='utf-8')) or {}

def norm(s):
    return str(s).strip()

def contains_forbidden_token(value, tokens):
    return next((t for t in tokens if t and t in value), None)

def command_prefix(value):
    try: parts=shlex.split(value, posix=os.name!='nt')
    except ValueError: return []
    return [p.lower() for p in parts]

def starts_with_command(parts, candidate):
    target=candidate.lower().split()
    return len(parts)>=len(target) and parts[:len(target)]==target

def main():
    ap=argparse.ArgumentParser(description='Static gate for agent tool arguments. Never executes tools.')
    ap.add_argument('--request',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--repo-root',default='.'); ap.add_argument('--output')
    a=ap.parse_args()
    try:
        req=load_json(a.request); policy=load_policy(a.policy)
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 3
    tool=norm(req.get('tool','')).lower(); args=req.get('arguments',{})
    if not tool or not isinstance(args,(dict,list)):
        print(json.dumps({'status':'error','error':'request must contain tool and arguments object/array'})); return 3
    flat=[]
    def walk(v,path='$'):
        if isinstance(v,dict):
            for k,x in v.items(): walk(x,f'{path}.{k}')
        elif isinstance(v,list):
            for i,x in enumerate(v): walk(x,f'{path}[{i}]')
        elif isinstance(v,(str,int,float,bool)) or v is None:
            flat.append((path,'' if v is None else str(v)))
        else: flat.append((path,str(v)))
    walk(args)
    findings=[]; approvals=[]
    if len(flat)>int(policy.get('max_arguments',64)): findings.append({'code':'TOO_MANY_ARGUMENTS','severity':'block','evidence':len(flat)})
    secret_res=[re.compile(p) for p in policy.get('secret_patterns',[])]
    repo=Path(a.repo_root).resolve()
    for path,value in flat:
        if len(value)>int(policy.get('max_argument_length',4096)): findings.append({'code':'ARGUMENT_TOO_LONG','severity':'block','path':path})
        for rx in secret_res:
            if rx.search(value): findings.append({'code':'POSSIBLE_SECRET','severity':'block','path':path})
        if policy.get('path_rules',{}).get('block_parent_traversal',True) and re.search(r'(^|[\\/])\.\.([\\/]|$)',value): findings.append({'code':'PARENT_TRAVERSAL','severity':'block','path':path,'evidence':value})
        if policy.get('path_rules',{}).get('block_absolute_paths_outside_repo',True):
            p=Path(value)
            if p.is_absolute():
                try: p.resolve().relative_to(repo)
                except Exception: findings.append({'code':'ABSOLUTE_PATH_OUTSIDE_REPO','severity':'block','path':path,'evidence':value})
    if tool in [x.lower() for x in policy.get('shell_tools',[])]:
        strings=[v for _,v in flat if v]
        joined=' '.join(strings)
        token=contains_forbidden_token(joined,policy.get('forbidden_shell_tokens',[]))
        if token: findings.append({'code':'SHELL_META_TOKEN','severity':'block','evidence':token})
        parts=command_prefix(joined)
        if not parts: findings.append({'code':'UNPARSABLE_COMMAND','severity':'block'})
        for cmd in policy.get('forbidden_commands',[]):
            if starts_with_command(parts,cmd): findings.append({'code':'FORBIDDEN_COMMAND','severity':'block','evidence':cmd})
        for cmd in policy.get('approval_required_commands',[]):
            if starts_with_command(parts,cmd): approvals.append({'code':'COMMAND_REQUIRES_APPROVAL','evidence':cmd})
    status='blocked' if findings else ('approval_required' if approvals else 'passed')
    result={'status':status,'tool':tool,'findings':findings,'approvals':approvals,'executed':False}
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if status=='blocked' else 4 if status=='approval_required' else 0
if __name__=='__main__': sys.exit(main())
