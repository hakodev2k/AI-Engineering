#!/usr/bin/env python3
from pathlib import Path
import json
import py_compile
import sys

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "README.md",
    "requirements.txt",
    "config/policy.yaml",
    "schemas/finding.schema.json",
    "rules/trust-boundaries.md",
    "skills/classify-untrusted-instructions.md",
    "skills/verify-agent-action.md",
    "subagents/trust-reviewer.md",
    "subagents/execution-verifier.md",
    "workflows/untrusted-instruction-gate.md",
    "hooks/lifecycle-hooks.md",
    "scripts/scan_untrusted_instructions.py",
    "scripts/verify_package.py",
    "tests/test_scanner.py",
    "examples/reviewed-finding.json"
]
FORBIDDEN = [
    "TODO",
    "implementation omitted",
    "remaining files omitted",
    "same as above",
    "add logic here",
    "continue similarly",
    "other files omitted for brevity"
]


def fail(message):
    print(f"FAIL: {message}", file=sys.stderr)
    return False


def main():
    ok = True
    for rel in REQUIRED:
        path = ROOT / rel
        if not path.is_file():
            ok = fail(f"missing required file: {rel}") and ok
        elif path.stat().st_size == 0:
            ok = fail(f"empty required file: {rel}") and ok

    for rel in REQUIRED:
        if rel == "scripts/verify_package.py":
            continue
        path = ROOT / rel
        if not path.is_file() or path.suffix not in {".md", ".py", ".json", ".yaml", ".txt"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for phrase in FORBIDDEN:
            if phrase.lower() in text.lower():
                ok = fail(f"forbidden placeholder phrase in {rel}: {phrase}") and ok

    try:
        json.loads((ROOT / "schemas/finding.schema.json").read_text(encoding="utf-8"))
        example = json.loads((ROOT / "examples/reviewed-finding.json").read_text(encoding="utf-8"))
        required_example = {"file", "severity", "line", "pattern", "excerpt", "disposition"}
        missing = required_example - set(example)
        if missing:
            ok = fail(f"example missing keys: {sorted(missing)}") and ok
    except Exception as exc:
        ok = fail(f"JSON validation failed: {exc}") and ok

    for rel in ["scripts/scan_untrusted_instructions.py", "scripts/verify_package.py", "tests/test_scanner.py"]:
        try:
            py_compile.compile(str(ROOT / rel), doraise=True)
        except Exception as exc:
            ok = fail(f"Python compile failed for {rel}: {exc}") and ok

    readme = ROOT / "README.md"
    if readme.is_file():
        readme_text = readme.read_text(encoding="utf-8", errors="replace")
        for rel in REQUIRED[1:]:
            if f"`{rel}`" not in readme_text:
                ok = fail(f"README does not reference required artifact: {rel}") and ok

    if ok:
        print(f"PASS: verified {len(REQUIRED)} required artifacts and Python/JSON integrity")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
