#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
EXT={'.cs','.py','.js','.ts','.java','.go','.rb'}
PATTERNS={
 'skip_take_without_order': re.compile(r'(Skip\s*\(|OFFSET\s+\d+).*?(Take\s*\(|LIMIT\s+\d+)',re.I|re.S),
 'unbounded_page_size': re.compile(r'(pageSize|limit|take)\s*[=:]\s*(request|query|input)\.',re.I),
 'cursor_without_tiebreaker_hint': re.compile(r'(cursor|continuationToken).*?(OrderBy|order_by|ORDER BY)\s*\(?\s*([A-Za-z0-9_\.]+)\s*\)?',re.I|re.S),
 'raw_continuation_state': re.compile(r'(cursor|continuationToken)\s*[=:].*(base64|json.dumps|JsonSerializer|serialize)',re.I)
}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root',nargs='?',default='.'); p.add_argument('--output'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  text=f.read_text(encoding='utf-8',errors='ignore')
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:200].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require contextual review; absence of findings does not prove pagination correctness.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
