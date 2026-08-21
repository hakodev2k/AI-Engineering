#!/usr/bin/env python3
"""Regression tests using synthetic credentials only."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "config" / "redaction-policy.json"
GUARD = ROOT / "scripts" / "secret_output_guard.py"
PREFLIGHT = ROOT / "scripts" / "command_preflight.py"

FAKE_GH = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890fake"
FAKE_EXACT = "synthetic-openai-value-1234567890-not-real"
FAKE_JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmYWtlLXVzZXIifQ.fakeSignature123456789"


def run_guard(text: str, extra_env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.update(extra_env or {})
    return subprocess.run(
        [sys.executable, str(GUARD), "--policy", str(POLICY)],
        input=text,
        text=True,
        capture_output=True,
        env=env,
        check=False,
    )


def run_preflight(command: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(PREFLIGHT), "--policy", str(POLICY), "--command", command],
        text=True,
        capture_output=True,
        check=False,
    )


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def test_exact_mask() -> None:
    result = run_guard(f"token={FAKE_EXACT}\n", {"OPENAI_API_KEY": FAKE_EXACT})
    assert_true(result.returncode == 0, f"exact mask failed rc={result.returncode}")
    assert_true(FAKE_EXACT not in result.stdout, "exact fake secret survived")
    assert_true("[REDACTED:" in result.stdout, "redaction marker missing")


def test_pattern_masks() -> None:
    result = run_guard(f"github={FAKE_GH}\njwt={FAKE_JWT}\n")
    assert_true(result.returncode == 0, f"pattern mask failed rc={result.returncode}")
    assert_true(FAKE_GH not in result.stdout, "fake GitHub token survived")
    assert_true(FAKE_JWT not in result.stdout, "fake JWT survived")


def test_sensitive_assignment() -> None:
    value = "not-a-real-database-password-12345"
    result = run_guard(f"password={value}\nnormal=value\n")
    assert_true(result.returncode == 0, "assignment sanitizer returned failure")
    assert_true(value not in result.stdout, "sensitive assignment survived")
    assert_true("normal=value" in result.stdout, "normal assignment was corrupted")


def test_preflight_direct_secret_reference() -> None:
    result = run_preflight('echo "$OPENAI_API_KEY"')
    assert_true(result.returncode == 2, "direct secret reference was not blocked")
    assert_true("OPENAI_API_KEY" not in result.stderr, "diagnostic should not echo variable name")


def test_preflight_env_dump() -> None:
    result = run_preflight("echo start; printenv; echo end")
    assert_true(result.returncode == 2, "printenv dump was not blocked")


def test_safe_command_allowed() -> None:
    result = run_preflight("git status --short")
    assert_true(result.returncode == 0, "ordinary command incorrectly blocked")


def test_metrics_never_contain_secret() -> None:
    env = os.environ.copy()
    env["OPENAI_API_KEY"] = FAKE_EXACT
    with tempfile.TemporaryDirectory() as td:
        metrics = Path(td) / "metrics.json"
        result = subprocess.run(
            [sys.executable, str(GUARD), "--policy", str(POLICY), "--metrics", str(metrics)],
            input=f"value={FAKE_EXACT}\n",
            text=True,
            capture_output=True,
            env=env,
            check=False,
        )
        assert_true(result.returncode == 0, "metrics test sanitizer failed")
        payload = metrics.read_text(encoding="utf-8")
        json.loads(payload)
        assert_true(FAKE_EXACT not in payload, "metrics leaked exact fake secret")
        assert_true(FAKE_EXACT not in result.stderr, "diagnostic leaked exact fake secret")


def main() -> int:
    tests = [
        test_exact_mask,
        test_pattern_masks,
        test_sensitive_assignment,
        test_preflight_direct_secret_reference,
        test_preflight_env_dump,
        test_safe_command_allowed,
        test_metrics_never_contain_secret,
    ]
    failed = 0
    for test in tests:
        try:
            test()
            print(f"PASS {test.__name__}")
        except Exception as exc:  # safe: fixtures are synthetic
            failed += 1
            print(f"FAIL {test.__name__}: {exc}", file=sys.stderr)
    print(f"tests={len(tests)} failed={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
