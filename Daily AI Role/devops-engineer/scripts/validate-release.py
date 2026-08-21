#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQ={'release_id','artifact','target_environment','risk','recovery','required_gates','approvals'}
if len(sys.argv)!=2:
    print('usage: validate-release.py <release-contract.json>', file=sys.stderr); sys.exit(2)
p=Path(sys.argv[1])
try:
    data=json.loads(p.read_text(encoding='utf-8'))
except Exception as e:
    print(f'invalid-json: {e}', file=sys.stderr); sys.exit(2)
missing=sorted(REQ-set(data))
if missing:
    print('missing-fields: '+', '.join(missing), file=sys.stderr); sys.exit(1)
if data['risk'] not in {'low','medium','high','critical'}:
    print('invalid-risk', file=sys.stderr); sys.exit(1)
if not isinstance(data['required_gates'], list) or not data['required_gates']:
    print('required_gates must be a non-empty array', file=sys.stderr); sys.exit(1)
if data['risk'] in {'high','critical'} and not data['approvals']:
    print('high/critical release requires approvals', file=sys.stderr); sys.exit(1)
print('release-contract-ok')
