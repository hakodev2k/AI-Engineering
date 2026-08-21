#!/usr/bin/env python3
import argparse, fnmatch, json, math, os, re, subprocess, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    yaml = None

def sh(args):
    p = subprocess.run(args, text=True, capture_output=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or 'command failed')
    return p.stdout

def entropy(s):
    if not s: return 0.0
    counts = {c:s.count(c) for c in set(s)}
    n=len(s)
    return -sum((v/n)*math.log2(v/n) for v in counts.values())

def load_policy(path):
    if yaml is None:
        raise RuntimeError('PyYAML is required: pip install pyyaml')
    with open(path, encoding='utf-8') as f: return yaml.safe_load(f)

def load_allowlist(path):
    p=Path(path)
    if not p.exists(): return []
    data=json.loads(p.read_text(encoding='utf-8'))
    if not isinstance(data,list): raise ValueError('allowlist must be a JSON array')
    return data

def ignored(path, patterns):
    return any(fnmatch.fnmatch(path, p) for p in patterns)

def changed_files(staged):
    cmd=['git','diff','--name-only'] + (['--cached'] if staged else []) + ['--diff-filter=ACMR']
    return [x for x in sh(cmd).splitlines() if x]

def added_lines(path, staged):
    cmd=['git','diff','--unified=0'] + (['--cached'] if staged else []) + ['--',path]
    out=sh(cmd); lines=[]; new_line=0
    for line in out.splitlines():
        if line.startswith('@@'):
            m=re.search(r'\+(\d+)', line); new_line=int(m.group(1)) if m else 0
        elif line.startswith('+') and not line.startswith('+++'):
            lines.append((new_line,line[1:])); new_line+=1
        elif not line.startswith('-'):
            new_line+=1
    return lines

def is_allowed(item, allow):
    return any(a.get('path')==item['path'] and a.get('pattern_id')==item['pattern_id'] and a.get('value_hash')==item['value_hash'] for a in allow)

def sha256(s):
    import hashlib
    return hashlib.sha256(s.encode()).hexdigest()

def scan(policy, staged):
    findings=[]; allow=load_allowlist(policy.get('allowlist_file','.secret-scan-allowlist.json'))
    for path in changed_files(staged):
        if ignored(path, policy.get('ignore_paths',[])): continue
        p=Path(path)
        if p.exists() and p.stat().st_size>policy.get('max_file_bytes',1048576): continue
        for lineno,text in added_lines(path, staged):
            for pat in policy.get('patterns',[]):
                for m in re.finditer(pat['regex'], text):
                    val=m.group(0); item={'path':path,'line':lineno,'pattern_id':pat['id'],'severity':pat['severity'],'value_hash':sha256(val)}
                    if not is_allowed(item,allow): findings.append(item)
            for token in re.findall(r'[A-Za-z0-9_\-\/+=]{20,}', text):
                if len(token)>=policy.get('min_entropy_length',20) and entropy(token)>=policy.get('entropy_threshold',4.2):
                    item={'path':path,'line':lineno,'pattern_id':'high-entropy-token','severity':'high','value_hash':sha256(token)}
                    if not is_allowed(item,allow): findings.append(item)
    unique=[]; seen=set()
    for f in findings:
        k=(f['path'],f['line'],f['pattern_id'],f['value_hash'])
        if k not in seen: seen.add(k); unique.append(f)
    return unique

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--policy',default='config/secret-policy.yaml'); ap.add_argument('--staged',action='store_true'); ap.add_argument('--output',default='secret-scan-result.json')
    args=ap.parse_args()
    try:
        policy=load_policy(args.policy); findings=scan(policy,args.staged)
        result={'status':'blocked' if findings else 'passed','findings':findings,'count':len(findings),'scope':'staged' if args.staged else 'working-tree'}
        Path(args.output).write_text(json.dumps(result,indent=2),encoding='utf-8')
        print(json.dumps(result,indent=2))
        blocked={x.lower() for x in policy.get('fail_on_severity',['high','critical'])}
        return 2 if any(f['severity'].lower() in blocked for f in findings) else 0
    except Exception as e:
        print(f'secret gate error: {e}',file=sys.stderr); return 3
if __name__=='__main__': sys.exit(main())
