#!/usr/bin/env python3
from pathlib import Path
import os, sys

REQUIRED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml",
"examples/impediment-record.example.json","hooks/lifecycle-hooks.md",
"knowledge/empiricism-and-team-systems.md","knowledge/scrum-accountabilities-and-boundaries.md",
"metrics/team-flow-health.md","rules/operating-rules.md","schemas/impediment-record.schema.json",
"scripts/validate-impediment-record.py","scripts/validate-package.py",
"skills/event-facilitation.md","skills/flow-and-wip-coaching.md","skills/impediment-management.md",
"skills/retrospective-improvement.md","skills/sprint-goal-protection.md",
"subagents/dependency-analyst.md","subagents/facilitation-reviewer.md","subagents/flow-health-analyst.md",
"subagents/retrospective-evidence-reviewer.md","templates/escalation-brief.md",
"templates/facilitation-plan.md","templates/failure-learning-record.md","templates/handoff.md",
"templates/improvement-experiment.md","workflows/impediment-resolution.md","workflows/scrum-event-cycle.md",
"workflows/sprint-disruption-response.md"]

def main():
    root = Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    errors = []
    if missing: errors.append("missing files: " + ", ".join(missing))
    for script in ["scripts/validate-impediment-record.py", "scripts/validate-package.py"]:
        p = root / script
        if os.name != "nt" and p.exists() and not (p.stat().st_mode & 0o111): errors.append(f"not executable: {script}")
    if errors:
        for e in errors: print("error:", e, file=sys.stderr)
        return 1
    print(f"package valid: {len(REQUIRED)} required files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
