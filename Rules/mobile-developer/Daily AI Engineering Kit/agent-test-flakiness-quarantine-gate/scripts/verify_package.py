#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
'README.md','config/flake-gate.json','schemas/flake-result.schema.json','rules/test-flakiness-rules.md',
'skills/triage-flaky-test.md','skills/quarantine-decision.md','subagents/flake-investigator.md','subagents/verification-agent.md',
'workflows/flaky-test-gate.md','hooks/post-test-flake-gate.md','scripts/run_flake_probe.py','scripts/verify_package.py',
'templates/flake-investigation-report.md','tests/test_run_flake_probe.py']

def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing:
        print('missing: '+', '.join(missing)); return 2
    cfg=json.loads((ROOT/'config/flake-gate.json').read_text(encoding='utf-8'))
    if cfg['max_probe_runs'] < 1 or cfg['max_probe_runs'] > 20:
        print('invalid max_probe_runs'); return 3
    text='\n'.join((ROOT/p).read_text(encoding='utf-8') for p in REQUIRED if p.endswith('.md'))
    banned=['implementation omitted','remaining files omitted','same as above','continue similarly']
    found=[x for x in banned if x in text.lower()]
    if found:
        print('banned placeholders: '+', '.join(found)); return 4
    print(f'package verified: {len(REQUIRED)} required files present'); return 0
if __name__=='__main__': sys.exit(main())
