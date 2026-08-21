#!/usr/bin/env python3
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "git_scan_guard.py"
POLICY = ROOT / "config" / "scan-budget.json"


def run_case(measurement, baseline=None):
    with tempfile.TemporaryDirectory() as td:
        m = Path(td) / "measurement.json"
        m.write_text(json.dumps(measurement), encoding="utf-8")
        cmd = [sys.executable, str(GUARD), str(m), "--policy", str(POLICY)]
        if baseline is not None:
            b = Path(td) / "baseline.json"
            b.write_text(json.dumps(baseline), encoding="utf-8")
            cmd += ["--baseline", str(b)]
        return subprocess.run(cmd, capture_output=True, text=True)


def test_fast_workspace_passes():
    r = run_case({
        "cross_fs_risk": False,
        "git_status_untracked": {"elapsed_ms": 80, "timeout": False},
        "bounded_walk": {"elapsed_ms": 120, "bounded": False}
    })
    assert r.returncode == 0, r.stderr + r.stdout
    assert json.loads(r.stdout)["status"] == "pass"


def test_slow_git_status_fails():
    r = run_case({
        "cross_fs_risk": False,
        "git_status_untracked": {"elapsed_ms": 5000, "timeout": False},
        "bounded_walk": {"elapsed_ms": 120, "bounded": False}
    })
    assert r.returncode == 3
    data = json.loads(r.stdout)
    assert data["status"] == "fail"
    assert any("git status" in x for x in data["failures"])


def test_timeout_fails():
    r = run_case({
        "cross_fs_risk": False,
        "git_status_untracked": {"elapsed_ms": 10000, "timeout": True},
        "bounded_walk": {"elapsed_ms": 100, "bounded": False}
    })
    assert r.returncode == 3
    assert "timed out" in r.stdout


def test_regression_fails():
    baseline = {
        "git_status_untracked": {"elapsed_ms": 100, "timeout": False},
        "bounded_walk": {"elapsed_ms": 100, "bounded": False}
    }
    current = {
        "cross_fs_risk": False,
        "git_status_untracked": {"elapsed_ms": 180, "timeout": False},
        "bounded_walk": {"elapsed_ms": 100, "bounded": False}
    }
    r = run_case(current, baseline)
    assert r.returncode == 3
    assert "regressed" in r.stdout


def test_wsl_cross_fs_warns_but_does_not_disable_security():
    r = run_case({
        "cross_fs_risk": True,
        "git_status_untracked": {"elapsed_ms": 80, "timeout": False},
        "bounded_walk": {"elapsed_ms": 100, "bounded": False}
    })
    assert r.returncode == 0
    data = json.loads(r.stdout)
    assert any("/mnt/" in x for x in data["warnings"])
    joined = " ".join(data["recommendations"]).lower()
    assert "full-access" not in joined or "do not" in joined


if __name__ == "__main__":
    tests = [v for k, v in globals().items() if k.startswith("test_") and callable(v)]
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
