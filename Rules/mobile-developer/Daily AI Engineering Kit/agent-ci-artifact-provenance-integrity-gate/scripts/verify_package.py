#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parents[1]
REQUIRED = [
    "README.md",
    "config/policy.yaml",
    "schemas/provenance-result.schema.json",
    "scripts/provenance_gate.py",
    "scripts/verify_package.py",
    "tests/test_provenance_gate.py",
    "rules/artifact-integrity-safety.md",
    "skills/artifact-provenance-investigation.md",
    "subagents/provenance-investigator.md",
    "subagents/verification-agent.md",
    "workflows/artifact-provenance-gate.md",
    "hooks/lifecycle.md",
    "templates/ci-snippet.yml",
    "examples/artifact-manifest.json"
]

missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
if missing:
    print("Missing required files:", *missing, sep="\n- ", file=sys.stderr)
    raise SystemExit(2)

for path in REQUIRED:
    text = (ROOT / path).read_text(encoding="utf-8", errors="ignore")
    for forbidden in ("implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"):
        if forbidden in text.lower():
            print(f"Forbidden placeholder phrase in {path}: {forbidden}", file=sys.stderr)
            raise SystemExit(3)

p = subprocess.run([sys.executable, "-m", "pytest", str(ROOT / "tests" / "test_provenance_gate.py"), "-q"])
raise SystemExit(p.returncode)
