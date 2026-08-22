#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "config/redaction-policy.yaml",
    "skills/pii-log-investigation.md",
    "skills/redaction-remediation.md",
    "rules/pii-log-safety.md",
    "subagents/log-evidence-agent.md",
    "subagents/security-verifier.md",
    "workflows/pii-log-redaction-gate.md",
    "hooks/lifecycle.md",
    "scripts/pii_log_gate.py",
    "scripts/verify_package.py",
    "schemas/pii-gate-result.schema.json",
    "examples/sample.log",
    "tests/test_pii_log_gate.py"
]
root = Path(__file__).resolve().parents[1]
missing=[p for p in REQUIRED if not (root/p).is_file()]
if missing:
    print("Missing files:\n" + "\n".join(missing)); sys.exit(2)
for p in REQUIRED:
    text=(root/p).read_text(encoding="utf-8",errors="ignore")
    if not text.strip():
        print(f"Empty file: {p}"); sys.exit(3)
    for banned in ["implementation omitted","remaining files omitted","same as above","add logic here","continue similarly"]:
        if banned in text.lower():
            print(f"Banned placeholder in {p}: {banned}"); sys.exit(4)
print(f"Package verified: {len(REQUIRED)} files")
