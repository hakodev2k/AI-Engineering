#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

PATTERNS = {
    "unsafe_release": re.compile(r"(?i)(delete|del|remove|release).{0,80}(lock|mutex)"),
    "lock_usage": re.compile(r"(?i)(distributedlock|redlock|mutex|semaphore|setnx|sp_getapplock|pg_advisory_lock|lockasync|acquirelock)"),
    "owner_token": re.compile(r"(?i)(owner.?token|lock.?token|lease.?id|fencing.?token|compare.?and.?delete|compare.?exchange)"),
    "renewal": re.compile(r"(?i)(renew|extend|refresh).{0,40}(lease|lock|ttl|expiry)"),
}
EXT={'.cs','.py','.js','.ts','.java','.go','.rb','.php','.sql'}
SKIP={'.git','bin','obj','node_modules','dist','build','.venv','venv'}

def files(root):
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in EXT and not any(x in SKIP for x in p.parts): yield p

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('root',nargs='?',default='.'); ap.add_argument('--json',action='store_true'); a=ap.parse_args()
    root=pathlib.Path(a.root).resolve(); findings=[]; lock_files=0
    for p in files(root):
        try: text=p.read_text('utf-8',errors='ignore')
        except OSError: continue
        if not PATTERNS['lock_usage'].search(text): continue
        lock_files+=1
        rel=str(p.relative_to(root))
        has_owner=bool(PATTERNS['owner_token'].search(text)); has_renew=bool(PATTERNS['renewal'].search(text))
        if not has_owner: findings.append({'file':rel,'risk':'high','code':'missing-owner-or-fencing-token','message':'Lock use found without visible ownership/fencing token protection.'})
        if PATTERNS['unsafe_release'].search(text) and not has_owner: findings.append({'file':rel,'risk':'critical','code':'unsafe-release','message':'Release/delete pattern may remove another owner’s lock after lease expiry.'})
        if not has_renew: findings.append({'file':rel,'risk':'medium','code':'no-renewal-evidence','message':'No lease renewal/extension evidence found; verify work always finishes before TTL.'})
    out={'scanned_root':str(root),'lock_files':lock_files,'findings':findings}
    print(json.dumps(out,indent=2) if a.json else '\n'.join(f"{x['risk'].upper()} {x['file']}: {x['message']}" for x in findings) or f'PASS: scanned {lock_files} lock-related files')
    return 2 if any(x['risk'] in ('critical','high') for x in findings) else 0
if __name__=='__main__': sys.exit(main())
