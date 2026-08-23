#!/usr/bin/env python3
import argparse, re
from pathlib import Path

EXT={'.cs','.sql','.py','.js','.ts','.java','.go'}
PAT=re.compile(r'\b(UPDATE|INSERT\s+INTO|DELETE\s+FROM|MERGE\s+INTO|SELECT\b.*\bFOR\s+UPDATE)\s+([\[\]`"\w.]+)',re.I)

def main():
    ap=argparse.ArgumentParser(description='Heuristically report database mutation/locking order by file.')
    ap.add_argument('root', nargs='?', default='.')
    args=ap.parse_args(); root=Path(args.root)
    if not root.exists(): print('ERROR: root not found'); return 2
    findings=0
    for p in root.rglob('*'):
        if not p.is_file() or p.suffix.lower() not in EXT or any(x in p.parts for x in ('.git','bin','obj','node_modules')): continue
        try: text=p.read_text(encoding='utf-8',errors='ignore')
        except OSError: continue
        targets=[m.group(2) for m in PAT.finditer(text)]
        if len(targets)>=2:
            findings+=1; print(f'{p}: '+ ' -> '.join(targets))
    print(f'Files with multi-target SQL order: {findings}')
    return 0
if __name__=='__main__': raise SystemExit(main())
