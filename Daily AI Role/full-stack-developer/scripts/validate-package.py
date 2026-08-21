#!/usr/bin/env python3
from pathlib import Path
import json, sys

EXPECTED = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml","examples/work-item.example.json","hooks/lifecycle-hooks.md",
"knowledge/full-stack-reasoning.md","knowledge/contracts-and-boundaries.md","knowledge/reliability-security-performance.md","metrics/full-stack-quality.md","rules/operating-rules.md","schemas/work-item.schema.json",
"scripts/validate-work-item.py","scripts/validate-package.py",
"skills/requirement-to-slice.md","skills/frontend-delivery.md","skills/backend-api-delivery.md","skills/data-persistence.md","skills/integration-delivery.md","skills/end-to-end-debugging.md","skills/release-readiness.md",
"subagents/frontend-reviewer.md","subagents/backend-reviewer.md","subagents/data-reviewer.md","subagents/security-reliability-reviewer.md",
"templates/work-item.md","templates/decision-record.md","templates/handoff.md",
"workflows/vertical-feature.md","workflows/production-defect.md","workflows/schema-api-change.md","workflows/release.md"]

def main():
    root=Path(sys.argv[1] if len(sys.argv)>1 else Path(__file__).resolve().parents[1])
    errors=[]
    for rel in EXPECTED:
        p=root/rel
        if not p.is_file(): errors.append(f"missing: {rel}")
        elif p.stat().st_size == 0: errors.append(f"empty: {rel}")
    for rel in ["schemas/work-item.schema.json","examples/work-item.example.json"]:
        p=root/rel
        if p.is_file():
            try: json.loads(p.read_text(encoding="utf-8"))
            except Exception as e: errors.append(f"invalid JSON {rel}: {e}")
    actual=sorted(str(p.relative_to(root)).replace('\\','/') for p in root.rglob('*') if p.is_file()) if root.exists() else []
    unexpected=sorted(set(actual)-set(EXPECTED))
    if unexpected: errors.append("unexpected files: " + ", ".join(unexpected))
    if errors:
        for e in errors: print("ERROR:", e, file=sys.stderr)
        return 1
    print(f"VALID: {len(EXPECTED)} files")
    return 0

if __name__ == "__main__": raise SystemExit(main())
