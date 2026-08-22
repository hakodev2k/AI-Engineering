#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
EXT={'.cs','.py','.js','.ts','.java','.go','.rb'}
PATTERNS={
 'raw_body_logging': re.compile(r'(log|logger|console).*?(body|payload|request|response)', re.I),
 'authorization_logging': re.compile(r'(log|logger|console).*?(authorization|bearer|cookie)', re.I),
 'connection_string_logging': re.compile(r'(log|logger|console).*?(connectionstring|connection_string)', re.I),
 'exception_data_dump': re.compile(r'(log|logger).*?(exception|error).*?(data|context|request)', re.I)
}
def main():
 ap=argparse.ArgumentParser(); ap.add_argument('root',nargs='?',default='.'); ap.add_argument('--output'); a=ap.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  text=f.read_text(encoding='utf-8',errors='ignore')
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:200].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require contextual review; they are not proof of leakage.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
