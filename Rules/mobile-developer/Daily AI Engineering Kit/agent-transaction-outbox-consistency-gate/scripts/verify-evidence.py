#!/usr/bin/env python3
import argparse, json, pathlib, sys
REQUIRED_VERIFICATION=('atomicity','publisher_safety','consumer_idempotency','retry_bounds')
def main():
    p=argparse.ArgumentParser(); p.add_argument('evidence'); a=p.parse_args(); path=pathlib.Path(a.evidence)
    if not path.is_file(): print('evidence file missing',file=sys.stderr); return 2
    try: data=json.loads(path.read_text(encoding='utf-8'))
    except Exception as e: print(f'invalid JSON: {e}',file=sys.stderr); return 2
    errors=[]
    if data.get('status') not in {'pending','approved','blocked','failed','verified'}: errors.append('invalid status')
    if not isinstance(data.get('findings'),list): errors.append('findings must be an array')
    v=data.get('verification',{})
    for key in REQUIRED_VERIFICATION:
        if not isinstance(v.get(key),bool): errors.append(f'verification.{key} must be boolean')
    if data.get('status')=='verified' and not all(v.get(k) is True for k in REQUIRED_VERIFICATION): errors.append('verified status requires all verification checks true')
    if errors:
        print('\n'.join(errors),file=sys.stderr); return 1
    print('evidence contract valid'); return 0
if __name__=='__main__': raise SystemExit(main())
