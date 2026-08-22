#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS={
  'breaker_without_timeout': re.compile(r'CircuitBreaker|circuit.?breaker',re.I),
  'unbounded_retry': re.compile(r'while\s*\(?(true|1)\)?|for\s*\(\s*;\s*;',re.I),
  'fallback_masks_failure': re.compile(r'catch\s*\([^)]*\)\s*\{[^{}]*(return\s+(null|default|true|false|new\s)|Task\.CompletedTask)',re.I|re.S),
  'half_open_unbounded': re.compile(r'half.?open',re.I),
}
TIMEOUT=re.compile(r'timeout|CancelAfter|CancellationToken',re.I)
RETRY=re.compile(r'retry|WaitAndRetry|RetryAsync',re.I)
EXT={'.cs','.py','.js','.ts','.java','.go'}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root',nargs='?',default='.'); p.add_argument('--output'); a=p.parse_args(); root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','bin','obj','node_modules')): continue
  try: t=f.read_text(encoding='utf-8',errors='ignore')
  except OSError: continue
  has_breaker=bool(PATTERNS['breaker_without_timeout'].search(t))
  if has_breaker and not TIMEOUT.search(t): findings.append({'pattern':'breaker_without_timeout','path':str(f.relative_to(root)),'line':1,'evidence':'breaker references found without visible timeout/cancellation signal'})
  if has_breaker and RETRY.search(t) and 'budget' not in t.lower(): findings.append({'pattern':'retry_inside_breaker_without_budget','path':str(f.relative_to(root)),'line':1,'evidence':'breaker and retry references coexist without visible retry budget marker'})
  for name in ('unbounded_retry','fallback_masks_failure'):
   for m in PATTERNS[name].finditer(t): findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':t.count('\n',0,m.start())+1,'evidence':m.group(0)[:180].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require repository-context validation.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
