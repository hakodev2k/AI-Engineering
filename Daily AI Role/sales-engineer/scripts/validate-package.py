#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED = [
"README.md","rules/operating-rules.md","config/role-config.yaml","schemas/engagement.schema.json",
"examples/engagement.example.json","checklists/definition-of-done.md","hooks/lifecycle-hooks.md",
"metrics/sales-engineering-quality.md","knowledge/discovery-and-qualification.md","knowledge/evidence-and-claims.md",
"knowledge/poc-and-demo-principles.md","skills/technical-discovery.md","skills/architecture-solution-mapping.md",
"skills/demo-design.md","skills/poc-design-and-evaluation.md","skills/technical-objection-handling.md",
"skills/technical-rfp-response.md","subagents/product-capability-researcher.md","subagents/architecture-fit-reviewer.md",
"subagents/security-trust-reviewer.md","subagents/value-evidence-reviewer.md","templates/discovery-record.md",
"templates/poc-plan.md","templates/solution-decision-record.md","templates/handoff.md",
"workflows/customer-technical-discovery.md","workflows/demo-and-evaluation.md","workflows/poc-execution.md",
"workflows/technical-rfp.md","scripts/validate-engagement.py","scripts/validate-package.py"]

def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    if missing:
        print("ERROR: missing files:\n" + "\n".join(missing), file=sys.stderr); return 1
    for p in (root / "schemas/engagement.schema.json", root / "examples/engagement.example.json"):
        try: json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"ERROR: invalid JSON {p}: {e}", file=sys.stderr); return 1
    for p in (root / "scripts/validate-engagement.py", root / "scripts/validate-package.py"):
        if p.stat().st_mode & 0o111 == 0:
            print(f"ERROR: script not executable: {p}", file=sys.stderr); return 1
    text = (root / "README.md").read_text(encoding="utf-8")
    for forbidden in ("implementation omitted","remaining files omitted","same as above","TODO"):
        if forbidden in text:
            print(f"ERROR: forbidden placeholder in README: {forbidden}", file=sys.stderr); return 1
    print(f"OK: package manifest verified ({len(REQUIRED)} files)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
