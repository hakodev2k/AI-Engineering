#!/usr/bin/env python3
import argparse, json, os, posixpath, sys
from pathlib import Path
from urllib.parse import urlparse

EXIT_ALLOW=0; EXIT_BLOCK=3; EXIT_ERROR=2

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(json.dumps({'decision':'error','reason':str(exc)})); raise SystemExit(EXIT_ERROR)

def norm_repo(value):
    v=str(value).strip().strip('/')
    if v.endswith('.git'): v=v[:-4]
    return v.casefold()

def norm_branch(value): return str(value).strip()

def norm_path(value):
    p=os.path.realpath(os.path.abspath(os.path.expanduser(str(value))))
    return os.path.normcase(p)

def under(path, root):
    try: return os.path.commonpath([path,root])==root
    except ValueError: return False

def norm_host(value):
    text=str(value).strip()
    parsed=urlparse(text if '://' in text else 'https://'+text)
    return (parsed.hostname or '').rstrip('.').casefold()

def evaluate(event, policy):
    reasons=[]
    tool=str(event.get('tool',''))
    if not tool: reasons.append('missing_tool')
    repo=event.get('repository')
    if repo is not None and norm_repo(repo) not in {norm_repo(x) for x in policy.get('repositories',[])}:
        reasons.append('repository_out_of_scope')
    branch=event.get('branch')
    if branch is not None and norm_branch(branch) not in set(policy.get('branches',[])):
        reasons.append('branch_out_of_scope')
    path=event.get('path')
    if path is not None:
        roots=[norm_path(x) for x in policy.get('filesystem_roots',[])]
        target=norm_path(path)
        if not roots or not any(under(target,r) for r in roots): reasons.append('filesystem_path_out_of_scope')
    endpoint=event.get('endpoint')
    if endpoint is not None and norm_host(endpoint) not in {norm_host(x) for x in policy.get('network_hosts',[])}:
        reasons.append('network_host_out_of_scope')
    if tool in set(policy.get('high_consequence_tools',[])) and policy.get('require_human_approval',True) and not event.get('human_approved',False):
        reasons.append('human_approval_required')
    decision='block' if reasons else 'allow'
    return {'decision':decision,'reasons':sorted(set(reasons)),'normalized':{'tool':tool,'repository':norm_repo(repo) if repo is not None else None,'branch':norm_branch(branch) if branch is not None else None,'path':norm_path(path) if path is not None else None,'host':norm_host(endpoint) if endpoint is not None else None}}

def main():
    ap=argparse.ArgumentParser(description='Fail-closed MCP target-scope guard')
    ap.add_argument('--event',required=True); ap.add_argument('--policy',required=True)
    a=ap.parse_args(); result=evaluate(load(a.event),load(a.policy)); print(json.dumps(result,indent=2,sort_keys=True)); return EXIT_ALLOW if result['decision']=='allow' else EXIT_BLOCK
if __name__=='__main__': raise SystemExit(main())
