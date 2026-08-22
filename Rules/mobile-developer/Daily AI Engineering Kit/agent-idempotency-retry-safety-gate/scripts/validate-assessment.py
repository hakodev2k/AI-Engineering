#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

VALID_STATUS={'pass','fail','blocked','needs-approval'}
VALID_TEST={'pass','fail','not-run'}
REQUIRED_VERIFICATION=('duplicate_delivery_test','retry_path_test','diff_review')

def main():
    ap=argparse.ArgumentParser(description='Validate an idempotency assessment JSON without external dependencies.')
    ap.add_argument('assessment')
    args=ap.parse_args()
    p=Path(args.assessment)
    if not p.is_file():
        print(f'missing assessment: {p}', file=sys.stderr); return 2
    try: data=json.loads(p.read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'invalid JSON: {exc}', file=sys.stderr); return 2
    errors=[]
    if data.get('status') not in VALID_STATUS: errors.append('invalid status')
    if not isinstance(data.get('scope'), list) or not data['scope']: errors.append('scope must be a non-empty array')
    if not isinstance(data.get('side_effects'), list): errors.append('side_effects must be an array')
    if not isinstance(data.get('retry_paths'), list): errors.append('retry_paths must be an array')
    if not isinstance(data.get('findings'), list): errors.append('findings must be an array')
    verification=data.get('verification')
    if not isinstance(verification, dict): errors.append('verification must be an object')
    else:
        for key in REQUIRED_VERIFICATION:
            if verification.get(key) not in VALID_TEST: errors.append(f'verification.{key} invalid or missing')
    if data.get('status')=='pass' and isinstance(verification,dict):
        for key in REQUIRED_VERIFICATION:
            if verification.get(key)!='pass': errors.append(f'pass status requires verification.{key}=pass')
    for idx,f in enumerate(data.get('findings',[]) if isinstance(data.get('findings'),list) else []):
        if not isinstance(f,dict) or not f.get('finding') or not f.get('recommended_action') or not f.get('evidence'):
            errors.append(f'finding[{idx}] is incomplete')
    if errors:
        for e in errors: print(f'ERROR: {e}', file=sys.stderr)
        return 1
    print('assessment valid')
    return 0

if __name__=='__main__': sys.exit(main())
