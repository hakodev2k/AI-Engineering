#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
"README.md","skills/investigate-flaky-test.md","skills/recover-quarantined-test.md","rules/flaky-test-safety.md","subagents/failure-investigator.md","subagents/verification-agent.md","workflows/flaky-test-quarantine.md","hooks/pre-quarantine.md","hooks/final-verification.md","scripts/flaky_gate.py","scripts/verify_package.py","config/policy.json","schemas/evidence.schema.json","templates/evidence.json","examples/evidence-pass.json","tests/test_flaky_gate.py"]

def main():
    missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
    if missing:
        print("Missing files: " + ", ".join(missing)); return 1
    try:
        policy=json.loads((ROOT/"config/policy.json").read_text())
        schema=json.loads((ROOT/"schemas/evidence.schema.json").read_text())
        example=json.loads((ROOT/"examples/evidence-pass.json").read_text())
    except Exception as e:
        print(f"JSON validation failed: {e}"); return 2
    if schema.get("type") != "object" or policy.get("max_test_reruns",0) < 1 or not example.get("observations"):
        print("Structured files failed semantic validation"); return 3
    for p in REQUIRED:
        text=(ROOT/p).read_text(encoding="utf-8")
        if not text.strip(): print(f"Empty file: {p}"); return 4
        if "implementation omitted" in text.lower() or "remaining files omitted" in text.lower(): print(f"Omission marker: {p}"); return 5
    print(f"Package verified: {len(REQUIRED)} required files present")
    return 0
if __name__ == "__main__": sys.exit(main())
