#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS={
  'swallowed_item_failure': re.compile(r'catch\s*\([^)]*\)\s*\{\s*(continue;|return;)?\s*\}',re.I|re.S),
  'retry_entire_batch_without_dedup': re.compile(r'(retry|executeasync|waitandretry).*?(foreach|for\s*\()',re.I|re.S),
  'unbounded_parallelism': re.compile(r'(Task\.WhenAll|Parallel\.ForEach|Promise\.all).*?(Select|map|foreach)',re.I|re.S),
  'batch_level_success_only': re.compile(r'(processed|success|completed)\s*=\s*(true|1).*?(foreach|for\s*\()',re.I|re.S),
  'non_durable_checkpoint': re.compile(r'(lastProcessed|checkpoint|cursor)\s*=.*?;',re.I)
}
EXT={'.cs','.py','.js','.ts','.java','.go','.rb'}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root',nargs='?',default='.'); p.add_argument('--output'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  try: text=f.read_text(encoding='utf-8',errors='ignore')
  except OSError: continue
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:180].replace('\n',' ')})
 report={'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require code-context validation.'}
 out=json.dumps(report,indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
