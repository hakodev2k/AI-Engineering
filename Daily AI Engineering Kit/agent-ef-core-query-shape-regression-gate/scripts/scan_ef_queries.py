#!/usr/bin/env python3
import argparse, fnmatch, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'})); sys.exit(3)

def ignored(path, globs):
    s=path.as_posix()
    return any(fnmatch.fnmatch(s,g) for g in globs)

def scan_file(path, policy):
    text=path.read_text(encoding='utf-8',errors='ignore')
    findings=[]
    lines=text.splitlines()
    include_count=len(re.findall(r'\.Include\s*\(',text))+len(re.findall(r'\.ThenInclude\s*\(',text))
    if include_count>int(policy.get('max_include_chain',2)):
        findings.append({'code':'EXCESSIVE_INCLUDE_CHAIN','severity':'warning','file':str(path),'evidence':include_count})
    for i,line in enumerate(lines,1):
        if policy.get('warn_on_asenumerable',True) and '.AsEnumerable(' in line:
            findings.append({'code':'ASENUMERABLE_CLIENT_EVAL_RISK','severity':'warning','file':str(path),'line':i})
        if re.search(r'\b(SaveChanges|SaveChangesAsync)\s*\(',line):
            window='\n'.join(lines[max(0,i-8):i])
            if re.search(r'\b(for|foreach|while)\s*\(',window):
                findings.append({'code':'SAVECHANGES_IN_LOOP','severity':'error','file':str(path),'line':i})
        if policy.get('warn_on_unbounded_tolist',True) and re.search(r'\.ToList(?:Async)?\s*\(\s*\)',line):
            window=' '.join(lines[max(0,i-5):i])
            if not re.search(r'\.(Where|Take|Skip|First|Single|Find)\s*\(',window):
                findings.append({'code':'POSSIBLY_UNBOUNDED_MATERIALIZATION','severity':'warning','file':str(path),'line':i})
    compact=re.sub(r'\s+',' ',text)
    for m in re.finditer(r'\.ToList(?:Async)?\s*\([^)]*\)(.{0,220})\.Where\s*\(',compact):
        findings.append({'code':'FILTER_AFTER_MATERIALIZATION','severity':'error','file':str(path),'evidence':m.group(0)[:180]})
    if policy.get('warn_on_sync_terminal_in_async_method',True):
        for m in re.finditer(r'async\s+[^\{]+\{([^}]|\}(?!\s*\}))*.{0}',text,re.S):
            body=m.group(0)
            if re.search(r'\.(ToList|First|FirstOrDefault|Single|SingleOrDefault|Count|Any)\s*\(',body):
                findings.append({'code':'SYNC_QUERY_IN_ASYNC_METHOD','severity':'warning','file':str(path)})
    return findings

def main():
    ap=argparse.ArgumentParser(description='Static heuristic gate for EF Core query-shape regressions.')
    ap.add_argument('--root',default='.')
    ap.add_argument('--policy',required=True)
    ap.add_argument('--output')
    args=ap.parse_args()
    try: policy=yaml.safe_load(Path(args.policy).read_text(encoding='utf-8')) or {}
    except Exception as e: print(json.dumps({'status':'error','error':str(e)})); return 3
    root=Path(args.root)
    findings=[]
    for p in root.rglob('*.cs'):
        rel=p.relative_to(root)
        if not ignored(rel,policy.get('ignore_globs',[])):
            findings.extend(scan_file(rel if root==Path('.') else p,policy))
    rank={'info':0,'warning':1,'error':2}
    threshold=rank.get(str(policy.get('severity_threshold','warning')).lower(),1)
    blocking=[f for f in findings if rank.get(f['severity'],1)>=threshold]
    result={'status':'blocked' if blocking else 'passed','files_scanned':len([p for p in root.rglob('*.cs') if not ignored(p.relative_to(root),policy.get('ignore_globs',[]))]),'findings':findings,'blocking_count':len(blocking)}
    text=json.dumps(result,indent=2)
    if args.output: Path(args.output).write_text(text+'\n',encoding='utf-8')
    print(text)
    return 2 if blocking else 0
if __name__=='__main__': sys.exit(main())
