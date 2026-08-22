#!/usr/bin/env python3
import argparse, json, pathlib, re, sys
PATTERNS = {
  "query-inside-loop": re.compile(r"(foreach|for\s*\().{0,500}(ToListAsync|FirstOrDefaultAsync|SingleOrDefaultAsync|CountAsync|AnyAsync|FindAsync)\s*\(", re.I|re.S),
  "per-item-find": re.compile(r"foreach.{0,400}\.FindAsync?\s*\(", re.I|re.S),
  "lazy-loading-navigation": re.compile(r"UseLazyLoadingProxies\s*\(|virtual\s+(ICollection|IEnumerable|List|HashSet)<", re.I),
  "materialize-before-filter": re.compile(r"(ToList|ToArray)\s*\(\)\s*\.\s*(Where|Select|OrderBy|GroupBy)\s*\(", re.I),
  "client-side-enumeration": re.compile(r"AsEnumerable\s*\(\)\s*\.\s*(Where|Select|OrderBy|GroupBy)\s*\(", re.I)
}
def main():
 p=argparse.ArgumentParser(); p.add_argument('root', nargs='?', default='.'); p.add_argument('--output'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory', file=sys.stderr); return 2
 findings=[]
 for f in root.rglob('*.cs'):
  if any(x in f.parts for x in ('.git','bin','obj','node_modules')): continue
  text=f.read_text(encoding='utf-8', errors='ignore')
  for name,rx in PATTERNS.items():
   for m in rx.finditer(text):
    findings.append({'pattern':name,'path':str(f.relative_to(root)),'line':text.count('\n',0,m.start())+1,'evidence':m.group(0)[:220].replace('\n',' ')})
 out=json.dumps({'root':str(root),'finding_count':len(findings),'findings':findings,'note':'Heuristic findings require code-context and runtime query-count verification.'},indent=2)
 if a.output: pathlib.Path(a.output).write_text(out+'\n',encoding='utf-8')
 else: print(out)
 return 1 if findings else 0
if __name__=='__main__': raise SystemExit(main())
