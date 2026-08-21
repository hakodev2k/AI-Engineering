#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS = {
  "non_constant_compare": re.compile(r"signature\s*==|==\s*signature|Equals\(.*signature", re.I),
  "parsed_body_before_verify": re.compile(r"(json\.loads|JsonSerializer\.Deserialize|ReadFromJsonAsync|req\.json\().*).*?(signature|hmac|sha256)", re.I | re.S),
  "missing_timestamp_context": re.compile(r"(hmac|signature).{0,200}(body|payload)", re.I | re.S),
  "hardcoded_webhook_secret": re.compile(r"(webhook[_-]?secret|signing[_-]?secret)\s*[=:]\s*[\"'][^\"']{8,}[\"']", re.I),
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
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:180].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require contextual review and are not proof of a vulnerability.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
