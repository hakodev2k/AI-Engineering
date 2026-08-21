#!/usr/bin/env python3
import json, sys

REQUIRED = ['task_id','objective','acceptance_criteria','owner','risk_level','constraints','approval_required']
ALLOWED_RISK = {'low','medium','high','critical'}

def main():
    if len(sys.argv) != 2:
        print('usage: validate-task.py <task.json>', file=sys.stderr); return 2
    try:
        data=json.load(open(sys.argv[1], encoding='utf-8'))
    except Exception as e:
        print(f'invalid json: {e}', file=sys.stderr); return 2
    missing=[k for k in REQUIRED if k not in data or data[k] in (None,'',[])]
    if missing:
        print('missing required fields: '+', '.join(missing), file=sys.stderr); return 1
    if data['risk_level'] not in ALLOWED_RISK:
        print('risk_level must be low|medium|high|critical', file=sys.stderr); return 1
    if not isinstance(data['acceptance_criteria'], list):
        print('acceptance_criteria must be a list', file=sys.stderr); return 1
    print('task contract: PASS'); return 0

if __name__ == '__main__': raise SystemExit(main())
