#!/usr/bin/env python3
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

RETRY = re.compile(r"\b(retry|retries|backoff|transient|polly|resilience|redeliver)\b", re.I)
SIDE = re.compile(r"\b(insert|update|delete|send|publish|charge|payment|email|webhook|upload|write|savechanges)\b", re.I)
GUARD = re.compile(r"\b(idempot|dedup|duplicate|unique|requestid|messageid|correlationid|processedmessage)\b", re.I)
TEXT_EXT = {'.cs','.ts','.js','.py','.java','.go','.rb','.php','.sql','.yaml','.yml','.json','.xml','.md'}


def changed_files(base: str):
    proc = subprocess.run(['git','diff','--name-only',base,'--'], text=True, capture_output=True)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or 'git diff failed')
    return [Path(x) for x in proc.stdout.splitlines() if x.strip()]


def scan(path: Path):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except OSError as exc:
        return {'path': str(path), 'error': str(exc)}
    retry_hits = [i for i,l in enumerate(text.splitlines(),1) if RETRY.search(l)]
    side_hits = [i for i,l in enumerate(text.splitlines(),1) if SIDE.search(l)]
    guard_hits = [i for i,l in enumerate(text.splitlines(),1) if GUARD.search(l)]
    score = min(len(retry_hits),3)*2 + min(len(side_hits),3)*2 - min(len(guard_hits),2)
    return {'path': str(path), 'retry_lines': retry_hits[:20], 'side_effect_lines': side_hits[:20], 'guard_lines': guard_hits[:20], 'risk_score': max(score,0)}


def main():
    ap = argparse.ArgumentParser(description='Scan changed files for retry + side-effect idempotency risk.')
    ap.add_argument('--base', default='HEAD~1', help='git diff base, default HEAD~1')
    ap.add_argument('--output', default='', help='optional JSON output path')
    args = ap.parse_args()
    try:
        files = changed_files(args.base)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr); return 2
    results=[]
    for p in files:
        if p.exists() and p.is_file() and p.suffix.lower() in TEXT_EXT:
            r=scan(p)
            if r.get('retry_lines') or r.get('side_effect_lines'):
                results.append(r)
    payload={'base':args.base,'files_scanned':len(files),'risk_files':results,'high_risk':[r['path'] for r in results if r.get('risk_score',0)>=8]}
    rendered=json.dumps(payload, indent=2)
    if args.output:
        out=Path(args.output); out.parent.mkdir(parents=True,exist_ok=True); out.write_text(rendered+'\n',encoding='utf-8')
    print(rendered)
    return 1 if payload['high_risk'] else 0

if __name__=='__main__':
    sys.exit(main())
