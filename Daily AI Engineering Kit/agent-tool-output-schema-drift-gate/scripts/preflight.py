#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=['README.md','schemas/tool-output-contract.schema.json','tests/cases.json','scripts/validate-tool-output.py','scripts/run-contract-tests.py','scripts/inspect-changes.py']
def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing:
        print('ERROR missing: '+', '.join(missing),file=sys.stderr); return 1
    for p in ['schemas/tool-output-contract.schema.json','tests/cases.json']:
        try: json.loads((ROOT/p).read_text(encoding='utf-8'))
        except Exception as exc:
            print(f'ERROR invalid JSON {p}: {exc}',file=sys.stderr); return 1
    print('PREFLIGHT OK'); return 0
if __name__=='__main__': sys.exit(main())
