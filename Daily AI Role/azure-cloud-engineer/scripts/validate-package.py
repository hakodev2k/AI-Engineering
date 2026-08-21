#!/usr/bin/env python3
from pathlib import Path
import os, sys
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
"README.md","config/role-config.yaml","rules/operating-rules.md","hooks/lifecycle-hooks.md",
"knowledge/azure-platform-principles.md","knowledge/service-selection.md","metrics/cloud-engineering-quality.md",
"schemas/workload-request.schema.json","examples/workload-request.example.json",
"scripts/validate-package.py","scripts/validate-workload-request.py",
"skills/azure-architecture-design.md","skills/identity-and-access-engineering.md","skills/network-and-private-connectivity.md","skills/infrastructure-as-code.md","skills/reliability-backup-dr.md","skills/cost-and-capacity-management.md",
"subagents/identity-network-reviewer.md","subagents/cost-capacity-analyst.md","subagents/reliability-reviewer.md","subagents/security-governance-reviewer.md",
"workflows/workload-onboarding.md","workflows/production-change.md","workflows/azure-incident-response.md","workflows/cost-capacity-optimization.md",
"templates/architecture-decision.md","templates/change-plan.md","templates/handoff.md","templates/failure-learning-record.md",
"checklists/definition-of-done.md"]
missing=[p for p in REQUIRED if not (ROOT/p).is_file()]
if missing:
    print("ERROR: missing files:\n"+"\n".join(missing),file=sys.stderr); sys.exit(1)
for p in ["scripts/validate-package.py","scripts/validate-workload-request.py"]:
    if os.name != "nt" and not os.access(ROOT/p, os.X_OK):
        print(f"ERROR: not executable: {p}",file=sys.stderr); sys.exit(1)
print(f"OK: {len(REQUIRED)} required files present; POSIX script permissions valid when applicable")
