#!/usr/bin/env python3
from pathlib import Path
import json, os, sys
ROOT = Path(__file__).resolve().parents[1]
required = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml","examples/advocacy-work.example.json","hooks/lifecycle-hooks.md",
"knowledge/developer-education-principles.md","knowledge/community-feedback-and-signal.md","knowledge/demos-samples-and-trust.md",
"metrics/developer-advocacy-quality.md","rules/operating-rules.md","schemas/advocacy-work.schema.json",
"scripts/validate-advocacy-work.py","scripts/validate-package.py",
"skills/developer-journey-analysis.md","skills/technical-content-production.md","skills/demo-and-workshop-design.md","skills/community-feedback-synthesis.md","skills/developer-issue-triage.md","skills/launch-enablement.md",
"subagents/sample-verifier.md","subagents/product-fact-reviewer.md","subagents/community-signal-analyst.md","subagents/security-publication-reviewer.md",
"templates/advocacy-brief.md","templates/feedback-handoff.md","templates/failure-learning-record.md","templates/publish-check.md",
"workflows/launch-enablement.md","workflows/tutorial-and-sample-production.md","workflows/community-feedback-loop.md","workflows/developer-issue-triage.md"]
missing=[p for p in required if not (ROOT/p).exists()]
if missing:
    print("ERROR missing:\n"+"\n".join(missing), file=sys.stderr); sys.exit(1)
for p in [ROOT/"schemas/advocacy-work.schema.json",ROOT/"examples/advocacy-work.example.json"]:
    try: json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: print(f"ERROR {p}: {e}", file=sys.stderr); sys.exit(1)
for p in [ROOT/"scripts/validate-advocacy-work.py",ROOT/"scripts/validate-package.py"]:
    if os.name != "nt" and not (p.stat().st_mode & 0o111): print(f"ERROR not executable: {p}", file=sys.stderr); sys.exit(1)
print(f"OK: {len(required)} required artifacts present")
