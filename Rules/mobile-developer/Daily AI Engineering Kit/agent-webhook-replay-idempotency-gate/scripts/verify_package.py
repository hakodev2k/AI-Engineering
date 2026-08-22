#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
required=['README.md','config/policy.yaml','schemas/decision.schema.json','scripts/webhook_gate.py','scripts/verify_package.py','skills/investigate-webhook-path.md','skills/implement-idempotency.md','rules/safety.md','subagents/repository-explorer.md','subagents/implementation-agent.md','subagents/verification-agent.md','workflows/webhook-replay-gate.md','hooks/lifecycle.md','tests/test_webhook_gate.py']
missing=[p for p in required if not (ROOT/p).is_file()]
if missing: print('missing:',*missing,sep='\n'); sys.exit(2)
json.loads((ROOT/'schemas/decision.schema.json').read_text())
for p in required:
    text=(ROOT/p).read_text(errors='ignore')
    if 'implementation omitted' in text.lower() or 'remaining files omitted' in text.lower(): print('placeholder:',p); sys.exit(3)
print(f'package verified: {len(required)} files')
