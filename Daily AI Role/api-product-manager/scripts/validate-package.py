#!/usr/bin/env python3
import os, sys
from pathlib import Path

EXPECTED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml","examples/api-change-request.example.json",
"hooks/lifecycle-hooks.md","knowledge/api-product-reasoning.md","knowledge/contracts-versioning-and-deprecation.md",
"knowledge/developer-experience-and-adoption.md","metrics/api-product-quality.md","rules/operating-rules.md",
"schemas/api-change-request.schema.json","scripts/validate-api-change-request.py","scripts/validate-package.py",
"skills/api-consumer-discovery.md","skills/api-contract-product-design.md","skills/api-portfolio-prioritization.md",
"skills/api-launch-readiness.md","skills/api-lifecycle-management.md","skills/api-adoption-analysis.md",
"subagents/consumer-dx-reviewer.md","subagents/contract-compatibility-reviewer.md","subagents/security-governance-reviewer.md",
"subagents/economics-adoption-reviewer.md","templates/api-product-brief.md","templates/decision-record.md",
"templates/deprecation-plan.md","templates/handoff.md","workflows/new-api-capability.md",
"workflows/breaking-change-review.md","workflows/api-launch.md","workflows/deprecation-and-migration.md"]

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1])
    missing = [p for p in EXPECTED if not (root / p).is_file()]
    if missing:
        print("ERROR: missing files:\n" + "\n".join(missing), file=sys.stderr); return 1
    for rel in ["scripts/validate-api-change-request.py","scripts/validate-package.py"]:
        if os.name != "nt" and not os.access(root / rel, os.X_OK):
            print(f"ERROR: {rel} is not executable", file=sys.stderr); return 1
    print(f"OK: {len(EXPECTED)} required files present")
    return 0
if __name__ == "__main__":
    raise SystemExit(main())
