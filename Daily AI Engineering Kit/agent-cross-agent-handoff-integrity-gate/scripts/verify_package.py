#!/usr/bin/env python3
import json, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "skills/prepare-handoff.md",
    "skills/verify-handoff.md",
    "rules/handoff-integrity.md",
    "subagents/handoff-producer.md",
    "subagents/handoff-verifier.md",
    "workflows/cross-agent-handoff-gate.md",
    "hooks/lifecycle.md",
    "scripts/handoff_gate.py",
    "scripts/verify_package.py",
    "config/handoff-policy.yaml",
    "schemas/handoff-envelope.schema.json",
    "templates/handoff-envelope.json",
    "examples/valid-handoff.json",
    "tests/test_handoff_gate.py"
]

def main():
    missing = [p for p in REQUIRED if not (ROOT / p).is_file()]
    if missing:
        print("Missing required files:", *missing, sep="\n- ", file=sys.stderr)
        return 2
    schema = json.loads((ROOT / "schemas/handoff-envelope.schema.json").read_text(encoding="utf-8"))
    if schema.get("type") != "object":
        print("Schema root must be object", file=sys.stderr)
        return 2
    cmd = [sys.executable, str(ROOT / "scripts/handoff_gate.py"), str(ROOT / "examples/valid-handoff.json")]
    result = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout, end="")
        print(result.stderr, end="", file=sys.stderr)
        return result.returncode
    print(f"package verification passed: {len(REQUIRED)} required files present")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
