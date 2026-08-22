#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED=[
"README.md","config/policy.yaml","schemas/tool-request.schema.json","scripts/permission_gate.py",
"scripts/verify_package.py","skills/evaluate-tool-request.md","skills/review-permission-escalation.md",
"rules/mcp-permission-safety.md","subagents/tool-policy-reviewer.md","subagents/verification-agent.md",
"workflows/mcp-permission-gate.md","hooks/lifecycle.md","templates/approval-request.md",
"examples/read-request.json","examples/external-write-request.json","tests/test_permission_gate.py"
]
root=Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).is_file()]
if missing:
    print("Missing files:\n"+"\n".join(missing)); sys.exit(1)
for p in REQUIRED:
    text=(root/p).read_text(encoding="utf-8")
    if not text.strip(): print(f"Empty file: {p}"); sys.exit(2)
    for banned in ["implementation omitted","remaining files omitted","same as above","add logic here","continue similarly"]:
        if banned in text.lower(): print(f"Banned placeholder in {p}: {banned}"); sys.exit(3)
print(f"Verified {len(REQUIRED)} required files")
