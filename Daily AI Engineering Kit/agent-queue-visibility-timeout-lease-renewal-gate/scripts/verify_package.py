#!/usr/bin/env python3
from pathlib import Path
import sys

REQUIRED = [
    "README.md",
    "config/lease-policy.yaml",
    "schemas/lease-result.schema.json",
    "scripts/lease_guard.py",
    "scripts/verify_package.py",
    "skills/lease-analysis.md",
    "skills/lease-safe-processing.md",
    "rules/queue-lease-safety.md",
    "subagents/queue-behavior-explorer.md",
    "subagents/lease-verifier.md",
    "workflows/lease-protection-workflow.md",
    "hooks/lifecycle.md",
    "templates/lease-investigation.md",
    "examples/lease-result-pass.json",
    "tests/test_lease_guard.py",
]


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    missing = [p for p in REQUIRED if not (root / p).is_file()]
    empty = [p for p in REQUIRED if (root / p).is_file() and (root / p).stat().st_size == 0]
    forbidden = []
    for p in REQUIRED:
        f = root / p
        if f.is_file() and f.suffix in {".md", ".py", ".json", ".yaml"}:
            text = f.read_text(encoding="utf-8").lower()
            for marker in ["implementation omitted", "remaining files omitted", "same as above", "continue similarly"]:
                if marker in text:
                    forbidden.append(f"{p}: {marker}")
    if missing or empty or forbidden:
        print("package verification failed")
        for item in missing: print(f"missing: {item}")
        for item in empty: print(f"empty: {item}")
        for item in forbidden: print(f"forbidden: {item}")
        return 2
    print(f"package verified: {len(REQUIRED)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
