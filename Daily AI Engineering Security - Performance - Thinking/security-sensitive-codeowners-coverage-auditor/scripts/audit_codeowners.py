#!/usr/bin/env python3
import argparse, fnmatch, json, sys
from pathlib import Path, PurePosixPath

def parse_codeowners(path):
    rules=[]
    for lineno,raw in enumerate(Path(path).read_text(encoding='utf-8').splitlines(),1):
        line=raw.strip()
        if not line or line.startswith('#'): continue
        parts=line.split()
        if len(parts)<2: continue
        pattern=parts[0]; owners=[x for x in parts[1:] if x.startswith('@')]
        if owners: rules.append((pattern,owners,lineno))
    if not rules: raise ValueError('CODEOWNERS contains no usable ownership rules')
    return rules

def match(pattern, rel):
    rel=rel.lstrip('/')
    p=pattern.strip()
    if p.startswith('!'): return False
    anchored=p.startswith('/'); p=p.lstrip('/')
    if p.endswith('/'):
        prefix=p.rstrip('/')
        return rel==prefix or rel.startswith(prefix+'/')
    if '/' not in p:
        return any(fnmatch.fnmatchcase(part,p) for part in PurePosixPath(rel).parts)
    if fnmatch.fnmatchcase(rel,p): return True
    if not anchored and fnmatch.fnmatchcase(rel,'*/'+p): return True
    return False

def effective_rule(rules, rel):
    found=None
    for r in rules:
        if match(r[0],rel): found=r
    return found

def load_manifest(path):
    obj=json.loads(Path(path).read_text(encoding='utf-8'))
    items=obj.get('paths') if isinstance(obj,dict) else None
    if not isinstance(items,list) or not items: raise ValueError('manifest.paths must be a non-empty array')
    out=[]
    for i,item in enumerate(items):
        if not isinstance(item,dict): raise ValueError(f'manifest.paths[{i}] must be an object')
        rel=item.get('path'); owners=item.get('required_owners')
        if not isinstance(rel,str) or not rel or rel.startswith('/') or '..' in PurePosixPath(rel).parts: raise ValueError(f'invalid manifest path at index {i}')
        if not isinstance(owners,list) or not owners or any(not isinstance(o,str) or not o.startswith('@') for o in owners): raise ValueError(f'invalid required_owners at index {i}')
        out.append((rel,owners))
    return out

def main():
    ap=argparse.ArgumentParser(description='Audit security-sensitive CODEOWNERS coverage')
    ap.add_argument('--repo',required=True); ap.add_argument('--codeowners',required=True); ap.add_argument('--manifest',required=True)
    a=ap.parse_args()
    try:
        root=Path(a.repo).resolve(); rules=parse_codeowners(a.codeowners); items=load_manifest(a.manifest)
    except Exception as exc:
        print(json.dumps({'status':'invalid','error':str(exc)},sort_keys=True)); return 1
    results=[]; failed=False
    for rel,required in items:
        exists=(root/rel).is_file() or (root/rel).is_dir()
        rule=effective_rule(rules,rel)
        owners=rule[1] if rule else []
        missing=[o for o in required if o not in owners]
        ok=exists and rule is not None and not missing
        failed |= not ok
        results.append({'path':rel,'exists':exists,'effective_pattern':rule[0] if rule else None,'effective_line':rule[2] if rule else None,'effective_owners':owners,'required_owners':required,'missing_owners':missing,'ok':ok})
    covered=sum(1 for x in results if x['ok'])
    out={'status':'pass' if not failed else 'blocked','covered':covered,'total':len(results),'coverage_percent':round(100*covered/len(results),2),'results':results}
    print(json.dumps(out,sort_keys=True))
    return 0 if not failed else 2

if __name__=='__main__': sys.exit(main())
