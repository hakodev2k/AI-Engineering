#!/usr/bin/env python3
import os, sys

FILES = [
"README.md","checklists/definition-of-done.md","config/role-config.yaml",
"examples/platform-change.example.json","hooks/lifecycle-hooks.md",
"knowledge/internal-developer-platform.md","knowledge/golden-paths-and-platform-contracts.md",
"metrics/platform-health.md","rules/operating-rules.md","schemas/platform-change.schema.json",
"scripts/validate-platform-change.py","scripts/validate-package.py",
"skills/platform-product-discovery.md","skills/golden-path-design.md","skills/self-service-automation.md",
"skills/platform-reliability.md","skills/developer-experience-analysis.md","skills/platform-lifecycle-management.md",
"subagents/developer-experience-reviewer.md","subagents/platform-reliability-reviewer.md",
"subagents/security-policy-reviewer.md","subagents/dependency-migration-reviewer.md",
"templates/platform-capability-spec.md","templates/exception-record.md","templates/migration-plan.md",
"templates/handoff.md","templates/failure-learning-record.md",
"workflows/new-platform-capability.md","workflows/platform-incident-response.md",
"workflows/breaking-contract-migration.md","workflows/developer-friction-improvement.md"
]

def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "."
    missing = [p for p in FILES if not os.path.isfile(os.path.join(root,p))]
    bad_exec=[]
    for p in ["scripts/validate-platform-change.py","scripts/validate-package.py"]:
        fp=os.path.join(root,p)
        if os.path.isfile(fp) and not os.access(fp, os.X_OK): bad_exec.append(p)
    if missing or bad_exec:
        if missing: print("Missing:\n"+"\n".join(missing), file=sys.stderr)
        if bad_exec: print("Not executable:\n"+"\n".join(bad_exec), file=sys.stderr)
        return 1
    print(f"VALID: {len(FILES)} required files present")
    return 0

if __name__ == "__main__": raise SystemExit(main())
