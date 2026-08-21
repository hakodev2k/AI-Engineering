#!/usr/bin/env python3
from pathlib import Path
import os, sys
root=Path(__file__).resolve().parents[1]
required=["README.md","rules/operating-rules.md","hooks/lifecycle-hooks.md","skills/workload-characterization.md","skills/profiling-and-bottleneck-analysis.md","skills/benchmark-engineering.md","skills/capacity-and-scalability-modeling.md","skills/performance-regression-triage.md","subagents/telemetry-analyst.md","subagents/benchmark-executor.md","subagents/code-path-profiler.md","subagents/verification-agent.md","workflows/performance-regression-investigation.md","workflows/optimization-validation.md","workflows/release-performance-gate.md","knowledge/performance-engineering-principles.md","knowledge/measurement-and-benchmarking-playbook.md","schemas/performance-test-contract.schema.json","examples/performance-test-contract.example.json","templates/benchmark-plan.md","templates/performance-handoff.md","checklists/definition-of-done.md","config/role-config.yaml","metrics/performance-delivery-health.md","scripts/validate-performance-contract.py"]
missing=[p for p in required if not (root/p).is_file()]
if missing:
    print("ERROR missing:\n"+"\n".join(missing), file=sys.stderr); sys.exit(2)
for p in [root/"scripts/validate-performance-contract.py", root/"scripts/validate-package.py"]:
    if os.name != "nt" and not os.access(p, os.X_OK):
        print(f"ERROR not executable: {p.name}", file=sys.stderr); sys.exit(3)
readme=(root/"README.md").read_text(encoding="utf-8")
for token in ["Mission","Responsibilities","Non-responsibilities","Human approval boundaries","Definition of done"]:
    if token not in readme:
        print(f"ERROR README missing section: {token}", file=sys.stderr); sys.exit(4)
print(f"OK: package validated ({len(required)+1} required artifacts including validator)")
