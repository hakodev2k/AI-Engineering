#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS={
 'local-now-in-domain': re.compile(r'\b(DateTime\.Now|DateTimeOffset\.Now|datetime\.now\(\)|new Date\(\))'),
 'unspecified-datetime': re.compile(r'new\s+DateTime\s*\([^\)]*\)|DateTimeKind\.Unspecified'),
 'manual-offset-math': re.compile(r'(AddHours|addHours|timedelta\s*\(\s*hours\s*=)\s*\(?\s*[+-]?\d+'),
 'date-truncation-before-zone': re.compile(r'\.Date\b|date\(\).*?(timezone|zone|offset)', re.I|re.S),
 'server-local-time-assumption': re.compile(r'(ToLocalTime\(\)|localtime\(|astimezone\(\s*\))'),
}
EXT={'.cs','.py','.js','.ts','.java','.go','.rb'}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root', nargs='?', default='.'); p.add_argument('--output'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj','.venv')): continue
  try: text=f.read_text(encoding='utf-8',errors='ignore')
  except OSError: continue
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:160].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings are review candidates, not confirmed defects.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
