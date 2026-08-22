#!/usr/bin/env python3
import sys
from pathlib import Path

REQUIRED = [
    "README.md", "rules/operating-rules.md",
    "skills/slo-engineering.md", "skills/incident-command.md",
    "skills/production-readiness-review.md", "skills/capacity-and-saturation-analysis.md",
    "skills/toil-reduction.md", "subagents/telemetry-researcher.md",
    "subagents/mitigation-executor.md", "subagents/reliability-reviewer.md",
    "subagents/verification-agent.md", "workflows/incident-response.md",
    "workflows/production-readiness-gate.md", "workflows/error-budget-release-control.md",
    "hooks/lifecycle-hooks.md", "knowledge/slo-and-error-budget-playbook.md",
    "knowledge/incident-and-resilience-principles.md", "config/role-config.yaml",
    "schemas/slo-contract.schema.json", "examples/slo-contract.example.json",
    "scripts/validate-slo.py", "scripts/validate-package.py",
    "templates/incident-handoff.md", "templates/production-readiness-review.md",
    "checklists/definition-of-done.md"
]
FORBIDDEN = ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly", "other files omitted for brevity"]

def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    if missing:
        print("ERROR missing files:\n- " + "\n- ".join(missing), file=sys.stderr)
        raise SystemExit(2)
    bad = []
    for rel in REQUIRED:
        text = (root / rel).read_text(encoding="utf-8", errors="replace").lower()
        for phrase in FORBIDDEN:
            if phrase in text:
                bad.append(f"{rel}: {phrase}")
    if bad:
        print("ERROR forbidden placeholders:\n- " + "\n- ".join(bad), file=sys.stderr)
        raise SystemExit(3)
    print(f"OK: {len(REQUIRED)} required package files verified")

if __name__ == "__main__":
    main()
