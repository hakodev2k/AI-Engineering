#!/usr/bin/env python3
from pathlib import Path
import json, sys

EXPECTED = [
"README.md", "rules/operating-rules.md", "checklists/definition-of-done.md",
"skills/mobile-requirement-framing.md", "skills/offline-sync-design.md", "skills/mobile-security-and-permissions.md",
"skills/mobile-performance-and-reliability.md", "skills/accessibility-and-device-experience.md", "skills/release-readiness.md",
"subagents/sync-and-data-reviewer.md", "subagents/security-and-privacy-reviewer.md",
"subagents/performance-reliability-reviewer.md", "subagents/release-evidence-reviewer.md",
"workflows/feature-delivery.md", "workflows/offline-sync-change.md", "workflows/production-hotfix.md", "workflows/store-release.md",
"hooks/lifecycle-hooks.md", "knowledge/mobile-runtime-and-lifecycle.md", "knowledge/mobile-quality-and-distribution.md",
"metrics/mobile-quality-metrics.md", "templates/mobile-work-item.md", "templates/release-record.md", "templates/failure-learning-record.md",
"schemas/mobile-work-item.schema.json", "examples/mobile-work-item.example.json",
"scripts/validate-mobile-work-item.py", "scripts/validate-package.py", "config/role-config.yaml"
]

def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
    errors = []
    for rel in EXPECTED:
        p = root / rel
        if not p.is_file(): errors.append(f"missing: {rel}")
        elif p.stat().st_size == 0: errors.append(f"empty: {rel}")
    for rel in ("schemas/mobile-work-item.schema.json", "examples/mobile-work-item.example.json"):
        try: json.loads((root / rel).read_text(encoding="utf-8"))
        except Exception as exc: errors.append(f"invalid JSON {rel}: {exc}")
    text = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in root.rglob("*") if p.is_file())
    if "TODO" in text: errors.append("placeholder TODO found")
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 1
    print(f"VALID: {len(EXPECTED)} expected files present and non-empty")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
