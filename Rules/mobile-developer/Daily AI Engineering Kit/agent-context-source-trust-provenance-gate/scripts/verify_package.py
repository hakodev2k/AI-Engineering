#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
"README.md","skills/source-assessment.md","skills/context-assembly.md","rules/context-trust-safety.md",
"subagents/source-curator.md","subagents/context-verifier.md","workflows/context-provenance-gate.md",
"hooks/lifecycle.md","scripts/context_trust_gate.py","scripts/verify_package.py","config/trust-policy.json",
"schemas/context-manifest.schema.json","templates/context-manifest.json","examples/context-manifest-pass.json",
"examples/context-manifest-block.json","tests/test_context_trust_gate.py"]

root = Path(__file__).resolve().parents[1]
missing = [p for p in REQUIRED if not (root / p).is_file()]
forbidden = ("implementation omitted", "remaining files omitted", "same as above", "continue similarly")
violations = []
for rel in REQUIRED:
    path = root / rel
    if path.is_file():
        text = path.read_text(encoding="utf-8", errors="ignore").lower()
        if any(token in text for token in forbidden):
            violations.append(rel)
if missing or violations:
    print("missing:", missing)
    print("forbidden placeholders:", violations)
    sys.exit(2)
print(f"package verified: {len(REQUIRED)} required files present")
