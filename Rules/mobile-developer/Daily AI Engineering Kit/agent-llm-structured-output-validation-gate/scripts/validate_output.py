#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path
try:
    import jsonschema
except ImportError:
    print('ERROR: install jsonschema: python -m pip install jsonschema', file=sys.stderr); sys.exit(3)

def main():
    p=argparse.ArgumentParser(); p.add_argument('output'); p.add_argument('--schema', default='schemas/agent-output.schema.json'); a=p.parse_args()
    try:
        data=json.loads(Path(a.output).read_text(encoding='utf-8')); schema=json.loads(Path(a.schema).read_text(encoding='utf-8'))
        jsonschema.Draft202012Validator.check_schema(schema)
        errors=sorted(jsonschema.Draft202012Validator(schema).iter_errors(data), key=lambda e:list(e.path))
    except (OSError,json.JSONDecodeError,jsonschema.SchemaError) as e:
        print(f'ERROR: {e}', file=sys.stderr); return 2
    if errors:
        for e in errors: print(f'INVALID {"/".join(map(str,e.path)) or "$"}: {e.message}', file=sys.stderr)
        return 1
    finding_ids={x['id'] for x in data['findings']}; evidence_ids={x['findingId'] for x in data['evidence']}
    missing=sorted(finding_ids-evidence_ids)
    if missing:
        print('INVALID: findings without evidence: '+', '.join(missing), file=sys.stderr); return 1
    if data['status']=='verified' and not all(data['verification'].values()):
        print('INVALID: verified requires all verification checks true', file=sys.stderr); return 1
    print('VALID'); return 0
if __name__=='__main__': sys.exit(main())
