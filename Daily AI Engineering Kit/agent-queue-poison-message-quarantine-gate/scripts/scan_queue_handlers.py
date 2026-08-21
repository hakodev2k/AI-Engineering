#!/usr/bin/env python3
import argparse,json,re,sys
from pathlib import Path
PATTERNS={
 "unbounded_retry":re.compile(r"while\s*\(?(?:true|1)\)?|for\s*\(\s*;\s*;\s*\)",re.I),
 "swallowed_exception":re.compile(r"catch\s*\([^)]*\)\s*\{\s*\}|except\s+(?:Exception|BaseException).*:\s*(?:pass)?",re.I|re.S),
 "manual_ack":re.compile(r"\b(?:ack|complete|delete|commit)\s*\(",re.I),
 "dead_letter":re.compile(r"dead.?letter|quarantin|poison",re.I),
 "idempotency":re.compile(r"idempoten|dedup|message.?id|event.?id",re.I)
}
EXT={'.cs','.py','.js','.ts','.java','.go'}
def main():
 p=argparse.ArgumentParser();p.add_argument('root',nargs='?',default='.');p.add_argument('--output',default='queue-gate-findings.json');a=p.parse_args()
 root=Path(a.root).resolve(); findings=[]
 if not root.exists(): print('root not found',file=sys.stderr);return 2
 for f in root.rglob('*'):
  if not f.is_file() or f.suffix.lower() not in EXT or any(x in f.parts for x in ('.git','node_modules','bin','obj')): continue
  try: text=f.read_text(encoding='utf-8',errors='ignore')
  except OSError: continue
  hits={k:bool(v.search(text)) for k,v in PATTERNS.items()}
  if hits['unbounded_retry'] or hits['swallowed_exception'] or hits['manual_ack']:
   risk='high' if hits['unbounded_retry'] or hits['swallowed_exception'] else 'medium'
   findings.append({'file':str(f.relative_to(root)),'risk':risk,'signals':[k for k,v in hits.items() if v],'has_quarantine_signal':hits['dead_letter'],'has_idempotency_signal':hits['idempotency']})
 out={'root':str(root),'finding_count':len(findings),'findings':findings}
 Path(a.output).write_text(json.dumps(out,indent=2),encoding='utf-8');print(json.dumps(out,indent=2));return 1 if any(x['risk']=='high' for x in findings) else 0
if __name__=='__main__': raise SystemExit(main())
