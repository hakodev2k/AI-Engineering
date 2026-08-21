#!/usr/bin/env python3
"""Self-contained regression tests for scan_github_actions.py."""
from __future__ import annotations
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SCANNER = HERE / "scripts" / "scan_github_actions.py"
POLICY = HERE / "config" / "policy.json"

VULNERABLE = '''name: unsafe
on:
  issues:
    types: [opened]
permissions:
  issues: write
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ github.event.issue.body }}"
      - uses: openai/codex-action@v1
'''

SAFE = '''name: safe
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: write
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - name: Treat issue text as data
        env:
          ISSUE_BODY: ${{ github.event.issue.body }}
        run: printf '%s\\n' "$ISSUE_BODY"
      - uses: openai/codex-action@v1
'''


def run_case(content: str) -> tuple[int, dict]:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        wf = root / ".github" / "workflows"
        wf.mkdir(parents=True)
        (wf / "test.yml").write_text(content, encoding="utf-8")
        p = subprocess.run(
            [sys.executable, str(SCANNER), str(root), "--policy", str(POLICY)],
            text=True, capture_output=True, check=False
        )
        if not p.stdout.strip():
            raise AssertionError(f"scanner produced no JSON: {p.stderr}")
        return p.returncode, json.loads(p.stdout)


def main() -> int:
    code, report = run_case(VULNERABLE)
    assert code == 3, (code, report)
    assert report["blocking"] >= 1, report
    assert any(f["rule"] == "direct-untrusted-run-interpolation" for f in report["findings"]), report

    code, report = run_case(SAFE)
    assert code == 0, (code, report)
    assert report["blocking"] == 0, report
    print("all workflow security scanner tests passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
