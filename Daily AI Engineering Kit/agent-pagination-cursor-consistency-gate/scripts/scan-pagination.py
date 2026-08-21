#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path
PATTERNS=[
('offset-pagination',r'\b(Skip|OFFSET)\s*\(?\s*\w+', 'medium','Offset pagination can duplicate/skip rows when the dataset mutates.'),
('take-without-order',r'\b(Take|LIMIT)\s*\(?\s*\d+', 'medium','Verify every bounded page has deterministic ordering.'),
('cursor-decode',r'(cursor|continuationToken).*(base64|decode|FromBase64)', 'low','Cursor decoding must validate structure, version and sort keys.'),
('unbounded-page-size',r'(pageSize|limit|take)\s*[=:]\s*(request|query|input)', 'high','Client page size must be clamped to a configured maximum.'),
]
def files(root):
 for p in root.rglob('*'):
  if p.is_file() and p.suffix.lower() in {'.cs','.ts','.js','.py','.sql'} and not any(x in p.parts for x in ('bin','obj','node_modules','dist')): yield p
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',default='.');ap.add_argument('--out',default='pagination-findings.json');a=ap.parse_args();root=Path(a.root);fs=[]
 if not root.exists(): print('root not found',file=sys.stderr);return 2
 for p in files(root):
  try: lines=p.read_text(encoding='utf-8',errors='ignore').splitlines()
  except OSError: continue
  for n,line in enumerate(lines,1):
   for ident,rx,sev,msg in PATTERNS:
    if re.search(rx,line,re.I): fs.append({'id':ident,'severity':sev,'file':str(p.relative_to(root)),'line':n,'finding':msg,'evidence':line.strip()[:500],'recommendation':'Inspect the complete query path and prove stable unique ordering, bounded size, cursor validation and forward progress.'})
 out={'status':'needs-review' if fs else 'pass','findings':fs,'errors':[]};Path(a.out).write_text(json.dumps(out,indent=2),encoding='utf-8');print(json.dumps({'findings':len(fs),'output':a.out}));return 1 if any(x['severity'] in ('high','critical') for x in fs) else 0
if __name__=='__main__': sys.exit(main())
