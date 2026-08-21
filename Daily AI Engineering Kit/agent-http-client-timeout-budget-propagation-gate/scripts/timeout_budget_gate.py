#!/usr/bin/env python3
import argparse, json, pathlib, re, sys, yaml

def load_policy(path):
    with open(path, 'r', encoding='utf-8') as f: return yaml.safe_load(f)

def scan(root, policy):
    findings=[]
    exts={'.cs','.py','.js','.ts','.java','.go'}
    for p in pathlib.Path(root).rglob('*'):
        if not p.is_file() or p.suffix.lower() not in exts: continue
        if any(x in p.parts for x in ('.git','bin','obj','node_modules','.venv')): continue
        text=p.read_text(encoding='utf-8', errors='ignore')
        checks=[('unbounded-timeout',r'Timeout\s*=\s*Timeout\.Infinite|Timeout\.InfiniteTimeSpan|timeout\s*=\s*None',policy.get('block_unbounded_timeout',True)),('missing-cancellation-dotnet',r'HttpClient\.(GetAsync|PostAsync|SendAsync)\([^\n;]*\)',policy.get('require_cancellation_propagation',True))]
        for kind,pattern,enabled in checks:
            if not enabled: continue
            for m in re.finditer(pattern,text):
                snippet=m.group(0)
                if kind=='missing-cancellation-dotnet' and 'cancellationToken' in snippet: continue
                findings.append({'type':kind,'file':str(p),'line':text.count('\n',0,m.start())+1,'evidence':snippet[:240]})
    return findings

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default='.'); ap.add_argument('--policy',required=True); ap.add_argument('--out',default='timeout-budget-report.json'); a=ap.parse_args()
    findings=scan(a.root,load_policy(a.policy)); result={'status':'pass' if not findings else 'block','findings':findings,'count':len(findings)}
    pathlib.Path(a.out).write_text(json.dumps(result,indent=2),encoding='utf-8'); print(json.dumps(result,indent=2)); return 0 if not findings else 2
if __name__=='__main__': sys.exit(main())
