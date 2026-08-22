#!/usr/bin/env python3
import argparse,json,pathlib,re,sys
PATTERNS={
 "unbounded_parallelism":re.compile(r"Task\.WhenAll\s*\(|Parallel\.ForEach\s*\(|Promise\.all\s*\(",re.I),
 "fixed_delay_retry":re.compile(r"(Task\.Delay|sleep|setTimeout)\s*\([^\n]*(1000|2000|5000)",re.I),
 "recursive_retry":re.compile(r"catch[\s\S]{0,240}(return\s+\w+\s*\(|await\s+\w+\s*\()",re.I),
 "retry_all_errors":re.compile(r"catch\s*\([^)]*\)[\s\S]{0,220}(retry|attempt|Task\.Delay)",re.I),
 "unbounded_queue":re.compile(r"Channel\.CreateUnbounded|ConcurrentQueue|BlockingCollection\s*<",re.I)
}
EXT={'.cs','.py','.js','.ts','.java','.go'}
def main():
 p=argparse.ArgumentParser();p.add_argument('root',nargs='?',default='.');p.add_argument('--output');a=p.parse_args();root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be directory',file=sys.stderr);return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  t=f.read_text(encoding='utf-8',errors='ignore')
  for name,rx in PATTERNS.items():
   for m in rx.finditer(t): findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':t.count('\n',0,m.start())+1,'evidence':m.group(0)[:180].replace('\n',' ')})
 r={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require code-context verification.'};s=json.dumps(r,indent=2)
 if a.output:pathlib.Path(a.output).write_text(s+'\n',encoding='utf-8')
 else:print(s)
 return 1 if findings else 0
if __name__=='__main__':raise SystemExit(main())
