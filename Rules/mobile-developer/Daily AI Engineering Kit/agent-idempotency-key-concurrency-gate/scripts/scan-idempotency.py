#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

PATTERNS = {
  "idempotency-key": re.compile(r"idempotenc(y|e)[-_ ]?key", re.I),
  "atomic-claim": re.compile(r"unique|upsert|insert.*conflict|compare.*exchange|setnx|transaction", re.I|re.S),
  "fingerprint": re.compile(r"fingerprint|request.*hash|payload.*hash|sha256", re.I|re.S),
  "persisted-outcome": re.compile(r"response.*(body|status)|result.*persist|cached.*response", re.I|re.S)
}
EXCLUDE={'.git','bin','obj','node_modules','.venv','dist','build'}

def main():
 p=argparse.ArgumentParser(); p.add_argument('root',nargs='?',default='.'); p.add_argument('--output',default='idempotency-scan.json'); a=p.parse_args()
 root=pathlib.Path(a.root).resolve()
 if not root.is_dir(): print('root must be a directory',file=sys.stderr); return 2
 hits={k:[] for k in PATTERNS}
 for f in root.rglob('*'):
  if not f.is_file() or any(x in EXCLUDE for x in f.parts) or f.suffix.lower() not in {'.cs','.java','.kt','.js','.ts','.py','.go','.rb','.php','.sql'}: continue
  try: text=f.read_text(errors='ignore')
  except OSError: continue
  for name,rx in PATTERNS.items():
   if rx.search(text): hits[name].append(str(f.relative_to(root)))
 missing=[k for k,v in hits.items() if not v]
 result={'root':str(root),'signals':hits,'missingSignals':missing,'status':'pass' if not missing else 'review'}
 pathlib.Path(a.output).write_text(json.dumps(result,indent=2),encoding='utf-8')
 print(json.dumps(result,indent=2)); return 0 if not missing else 1
if __name__=='__main__': sys.exit(main())
