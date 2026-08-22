#!/usr/bin/env python3
import json, sys
from pathlib import Path

def fail(msg, code=2):
    print(f'ERROR: {msg}', file=sys.stderr); raise SystemExit(code)
if len(sys.argv)!=2: fail('usage: validate-project-plan.py <project-plan.json>')
p=Path(sys.argv[1])
try: data=json.loads(p.read_text(encoding='utf-8'))
except Exception as e: fail(f'cannot read JSON: {e}')
required=['project_id','objective','sponsor','project_manager','status','scope','milestones','dependencies','risks','open_decisions']
missing=[k for k in required if k not in data]
if missing: fail('missing fields: '+', '.join(missing))
if data['status'] not in {'not-started','on-track','at-risk','off-track','blocked','complete'}: fail('invalid status')
for key in ['milestones','dependencies','risks','open_decisions']:
    if not isinstance(data[key], list): fail(f'{key} must be a list')
print('Project plan contract valid.')
