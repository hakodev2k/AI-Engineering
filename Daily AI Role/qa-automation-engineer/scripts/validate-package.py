#!/usr/bin/env python3
"""Validate package structure and optionally a QA task contract without third-party deps."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

REQUIRED_PACKAGE_PATHS = [
    "README.md", "rules/operating-rules.md", "skills/test-strategy.md", "skills/playwright-automation.md",
    "skills/api-automation.md", "skills/regression-analysis.md", "skills/flaky-test-triage.md",
    "subagents/repository-explorer.md", "subagents/automation-implementer.md", "subagents/test-reviewer.md",
    "subagents/verification-agent.md", "workflows/new-feature-automation.md", "workflows/regression-release-gate.md",
    "workflows/flaky-test-recovery.md", "hooks/lifecycle-hooks.md", "knowledge/automation-principles.md",
    "knowledge/playwright-reliability.md", "templates/test-plan.md", "templates/handoff.md",
    "checklists/definition-of-done.md", "config/role-config.yaml", "schemas/task-contract.schema.json",
    "examples/task-contract.example.json", "scripts/run-quality-gates.ps1",
]

def validate_package(root: Path) -> list[str]:
    errors=[]
    for rel in REQUIRED_PACKAGE_PATHS:
        p=root/rel
        if not p.is_file(): errors.append(f"missing required file: {rel}")
        elif p.stat().st_size == 0: errors.append(f"empty required file: {rel}")
    forbidden=("implementation omitted","remaining files omitted","same as above","continue similarly")
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() in {".md",".json",".yaml",".yml",".py",".ps1"}:
            try: s=p.read_text(encoding="utf-8").lower()
            except UnicodeDecodeError: continue
            for marker in forbidden:
                if marker in s: errors.append(f"forbidden placeholder phrase in {p.relative_to(root)}: {marker}")
    return errors

def validate_task(path: Path) -> list[str]:
    errors=[]
    try: data=json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc: return [f"cannot parse task JSON: {exc}"]
    for key in ("goal","expectedOutput","priority","acceptanceCriteria"):
        if key not in data: errors.append(f"task missing required field: {key}")
    if data.get("priority") not in {"critical","high","medium","low"}: errors.append("priority must be critical|high|medium|low")
    ac=data.get("acceptanceCriteria")
    if not isinstance(ac,list) or not ac or any(not isinstance(x,str) or not x.strip() for x in ac):
        errors.append("acceptanceCriteria must be a non-empty array of non-empty strings")
    for key in ("goal","expectedOutput"):
        if key in data and (not isinstance(data[key],str) or not data[key].strip()): errors.append(f"{key} must be a non-empty string")
    return errors

def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root", default=str(Path(__file__).resolve().parents[1]))
    ap.add_argument("--task", help="optional JSON task contract")
    args=ap.parse_args()
    errors=validate_package(Path(args.root))
    if args.task: errors += validate_task(Path(args.task))
    if errors:
        for e in errors: print(f"ERROR: {e}", file=sys.stderr)
        return 1
    print("Validation passed.")
    return 0

if __name__=="__main__": raise SystemExit(main())
