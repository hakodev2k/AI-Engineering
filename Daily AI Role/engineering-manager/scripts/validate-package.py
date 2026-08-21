#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
required = [
    "README.md", "rules/operating-rules.md", "checklists/definition-of-done.md",
    "config/role-config.yaml", "hooks/lifecycle-hooks.md",
    "schemas/team-work-contract.schema.json", "examples/team-work-contract.example.json",
    "skills/delivery-management.md", "skills/people-leadership.md",
    "skills/capacity-and-staffing.md", "skills/performance-and-growth.md",
    "skills/dependency-and-escalation-management.md",
    "workflows/quarterly-team-planning.md", "workflows/performance-gap-management.md",
    "workflows/incident-and-interrupt-management.md"
]
missing = [p for p in required if not (ROOT / p).is_file()]
if missing:
    print("Missing required package files:")
    for p in missing: print(f"- {p}")
    sys.exit(2)
for p in ROOT.rglob("*"):
    if p.is_file():
        text = p.read_text(errors="ignore")
        if "TODO" in text or "TBD" in text:
            print(f"Placeholder found: {p.relative_to(ROOT)}")
            sys.exit(3)
print(f"Package valid: {len(required)} required files present; no TODO/TBD placeholders")
