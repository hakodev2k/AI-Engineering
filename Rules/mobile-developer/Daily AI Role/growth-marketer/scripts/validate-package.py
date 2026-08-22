#!/usr/bin/env python3
import json, sys
from pathlib import Path

EXPECTED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml","examples/growth-work-item.example.json",
"hooks/lifecycle-hooks.md","knowledge/channel-and-lifecycle-principles.md","knowledge/experimentation-principles.md","knowledge/growth-model.md",
"metrics/growth-quality-metrics.md","rules/operating-rules.md","schemas/growth-work-item.schema.json",
"scripts/validate-growth-work-item.py","scripts/validate-package.py",
"skills/activation-optimization.md","skills/channel-economics.md","skills/experiment-design.md","skills/funnel-diagnosis.md","skills/instrumentation-and-measurement.md","skills/retention-and-lifecycle.md",
"subagents/channel-economics-reviewer.md","subagents/experiment-reviewer.md","subagents/lifecycle-quality-reviewer.md","subagents/measurement-reviewer.md",
"templates/experiment-readout.md","templates/growth-brief.md","templates/handoff.md",
"workflows/channel-allocation-review.md","workflows/funnel-regression-response.md","workflows/growth-experiment.md","workflows/lifecycle-campaign.md"]

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
errors=[]
for rel in EXPECTED:
    p=root/rel
    if not p.is_file(): errors.append(f"missing: {rel}")
    elif p.stat().st_size == 0: errors.append(f"empty: {rel}")
for rel in ["schemas/growth-work-item.schema.json","examples/growth-work-item.example.json"]:
    p=root/rel
    if p.is_file():
        try: json.loads(p.read_text(encoding="utf-8"))
        except Exception as exc: errors.append(f"invalid JSON {rel}: {exc}")
if errors:
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
print(f"VALID PACKAGE: {len(EXPECTED)} files")
