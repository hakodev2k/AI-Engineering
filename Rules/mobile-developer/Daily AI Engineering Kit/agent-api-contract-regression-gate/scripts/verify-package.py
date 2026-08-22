#!/usr/bin/env python3
from __future__ import annotations

import json
import pathlib
import py_compile
import sys

REQUIRED = [
    "README.md",
    "config/gate.yaml",
    "rules/api-contract-safety.md",
    "skills/capture-contract-baseline.md",
    "skills/compare-contracts.md",
    "subagents/contract-reviewer.md",
    "workflows/api-contract-regression-gate.md",
    "hooks/pre-merge.md",
    "scripts/capture-openapi.sh",
    "scripts/compare-openapi.py",
    "scripts/verify-package.py",
    "schemas/contract-report.schema.json",
    "tests/test_compare_openapi.py",
    "examples/baseline-openapi.json",
    "examples/candidate-openapi.json",
]

REFERENCES = [
    "scripts/capture-openapi.sh",
    "scripts/compare-openapi.py",
    "scripts/verify-package.py",
    "schemas/contract-report.schema.json",
    "config/gate.yaml",
    "subagents/contract-reviewer.md",
    "skills/capture-contract-baseline.md",
    "skills/compare-contracts.md",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)


def main() -> int:
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    errors = 0

    for relative in REQUIRED:
        path = root / relative
        if not path.is_file():
            fail(f"missing required file: {relative}")
            errors += 1
        elif path.stat().st_size == 0:
            fail(f"empty required file: {relative}")
            errors += 1

    for relative in ["schemas/contract-report.schema.json", "examples/baseline-openapi.json", "examples/candidate-openapi.json"]:
        path = root / relative
        if path.is_file():
            try:
                json.loads(path.read_text(encoding="utf-8"))
            except Exception as exc:
                fail(f"invalid JSON in {relative}: {exc}")
                errors += 1

    for relative in ["scripts/compare-openapi.py", "scripts/verify-package.py", "tests/test_compare_openapi.py"]:
        path = root / relative
        if path.is_file():
            try:
                py_compile.compile(str(path), doraise=True)
            except py_compile.PyCompileError as exc:
                fail(f"Python syntax error in {relative}: {exc.msg}")
                errors += 1

    readme = root / "README.md"
    if readme.is_file():
        text = readme.read_text(encoding="utf-8")
        for reference in REFERENCES:
            if reference not in text:
                fail(f"README missing reference: {reference}")
                errors += 1

    forbidden = ["implementation omitted", "remaining files omitted", "same as above", "add logic here", "continue similarly"]
    for relative in REQUIRED:
        path = root / relative
        if path.is_file() and path.suffix in {".md", ".py", ".sh", ".yaml", ".json"}:
            text = path.read_text(encoding="utf-8").lower()
            for phrase in forbidden:
                if phrase in text:
                    fail(f"forbidden placeholder phrase in {relative}: {phrase}")
                    errors += 1

    if errors:
        print(f"verification failed with {errors} error(s)", file=sys.stderr)
        return 1
    print(f"verification passed: {len(REQUIRED)} required files present")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
