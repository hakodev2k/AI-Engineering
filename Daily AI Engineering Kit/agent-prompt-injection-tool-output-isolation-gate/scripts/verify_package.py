#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
"README.md",
"config/policy.yaml",
"schemas/gate-result.schema.json",
"scripts/prompt_injection_gate.py",
"scripts/verify_package.py",
"skills/untrusted-context-intake.md",
"skills/tool-output-evidence-review.md",
"rules/prompt-injection-safety.md",
"subagents/context-boundary-reviewer.md",
"subagents/verification-agent.md",
"workflows/untrusted-context-gate.md",
"hooks/lifecycle.md",
"examples/benign-tool-output.txt",
"examples/malicious-tool-output.txt",
"tests/test_prompt_injection_gate.py"
]
root = Path(__file__).resolve().parents[1]
missing = [p for p in REQUIRED if not (root / p).is_file()]
if missing:
    print("Missing files:")
    for p in missing: print(p)
    sys.exit(2)
for p in REQUIRED:
    text = (root / p).read_text(encoding="utf-8", errors="ignore")
    lowered = text.lower()
    for banned in ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly"]:
        if banned in lowered:
            print(f"Placeholder phrase found in {p}: {banned}")
            sys.exit(3)
print(f"Package verified: {len(REQUIRED)} files")
