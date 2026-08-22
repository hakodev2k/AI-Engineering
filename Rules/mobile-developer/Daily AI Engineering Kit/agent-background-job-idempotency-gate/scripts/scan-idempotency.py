#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS = {
  "unbounded_retry": re.compile(r"while\s*\(?(true|1)\)?|for\s*\(\s*;\s*;", re.I),
  "random_idempotency_key": re.compile(r"Guid\.NewGuid\(\)|uuid\.uuid4\(\)|randomUUID\(\)"),
  "ack_before_commit": re.compile(r"(ack|complete|delete).*?(savechanges|commit)", re.I | re.S),
  "non_atomic_check_then_write": re.compile(r"(exists|any|find|select).*?(insert|add|create)", re.I | re.S),
}
EXT={'.cs','.py','.js','.ts','.java','.go','.rb'}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root', nargs='?', default='.'); p.add_argument('--output'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory', file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  try: text=f.read_text(encoding='utf-8', errors='ignore')
  except OSError: continue
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    line=text.count('\n',0,m.start())+1
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':line,'evidence':m.group(0)[:180].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require evidence-based review; they are not proof of a defect.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
