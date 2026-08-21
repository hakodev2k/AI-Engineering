#!/usr/bin/env python3
import argparse, json, sys
from datetime import date
from pathlib import Path

REQUIRED = {"name","owner","default","environments","kill_switch","expiry_date","verification_metrics"}
ALLOWED_STEPS = {1,5,10,25,50,100}

def fail(msg):
    print(msg, file=sys.stderr)
    return 1

def main():
    p=argparse.ArgumentParser(description='Validate feature flag rollout contracts')
    p.add_argument('path')
    p.add_argument('--environment', default='development')
    p.add_argument('--approval-file')
    args=p.parse_args()
    path=Path(args.path)
    if not path.exists(): return fail(f'file not found: {path}')
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except Exception as e: return fail(f'invalid json: {e}')
    flags=data if isinstance(data,list) else [data]
    errors=[]; warnings=[]
    approval=False
    if args.approval_file and Path(args.approval_file).exists():
        try: approval=bool(json.loads(Path(args.approval_file).read_text()).get('approved'))
        except Exception: pass
    for i,f in enumerate(flags):
        missing=REQUIRED-set(f)
        if missing: errors.append(f'[{i}] missing fields: {sorted(missing)}'); continue
        if not f.get('owner'): errors.append(f'[{i}] missing owner')
        if f.get('kill_switch') is not True: errors.append(f'[{i}] kill_switch must be true')
        metrics=f.get('verification_metrics') or []
        if not metrics: errors.append(f'[{i}] verification_metrics must not be empty')
        pct=f.get('rollout_percent',0)
        if pct not in ({0}|ALLOWED_STEPS): errors.append(f'[{i}] rollout_percent {pct} is not an allowed step')
        try:
            exp=date.fromisoformat(f['expiry_date'])
            if exp < date.today(): errors.append(f'[{i}] stale flag expired {exp.isoformat()}')
        except Exception: errors.append(f'[{i}] expiry_date must be YYYY-MM-DD')
        if args.environment=='production':
            if f.get('default') is True and not approval: errors.append(f'[{i}] production default=true requires approval')
            if pct>25 and not approval: errors.append(f'[{i}] production rollout above 25% requires approval')
        if pct==100 and f.get('targeting'): warnings.append(f'[{i}] targeting remains at 100%; schedule cleanup review')
    for w in warnings: print('WARN:',w)
    for e in errors: print('ERROR:',e,file=sys.stderr)
    if errors: return 2
    print(f'PASS: validated {len(flags)} flag contract(s)')
    return 0

if __name__=='__main__': sys.exit(main())
