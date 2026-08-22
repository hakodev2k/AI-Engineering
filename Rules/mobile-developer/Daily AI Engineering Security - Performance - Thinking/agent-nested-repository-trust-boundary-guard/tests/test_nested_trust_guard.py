#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
SCRIPT = HERE / "scripts" / "nested_trust_guard.py"
BASE_POLICY = HERE / "config" / "policy.json"


def run(root: Path, policy: Path):
    p = subprocess.run([sys.executable, str(SCRIPT), "--root", str(root), "--policy", str(policy)], text=True, capture_output=True)
    data = json.loads(p.stdout) if p.stdout.strip().startswith("{") else None
    return p.returncode, data


def test_clean_workspace_passes(tmp: Path):
    (tmp / ".git").mkdir()
    code, report = run(tmp, BASE_POLICY)
    assert code == 0
    assert report["metrics"]["violations"] == 0


def test_nested_repo_blocks(tmp: Path):
    (tmp / ".git").mkdir()
    nested = tmp / "vendor" / "dep" / ".git"
    nested.mkdir(parents=True)
    code, report = run(tmp, BASE_POLICY)
    assert code == 2
    assert report["metrics"]["nested_roots"] == 1


def test_active_nested_hook_detected(tmp: Path):
    (tmp / ".git").mkdir()
    hooks = tmp / "vendor" / "dep" / ".git" / "hooks"
    hooks.mkdir(parents=True)
    (hooks / "pre-commit").write_text("#!/bin/sh\nexit 0\n", encoding="utf-8")
    code, report = run(tmp, BASE_POLICY)
    assert code == 2
    assert report["metrics"]["active_nested_hooks"] == 1


def test_nested_agent_settings_block(tmp: Path):
    (tmp / ".git").mkdir()
    cfg = tmp / "services" / "api" / ".claude"
    cfg.mkdir(parents=True)
    (cfg / "settings.local.json").write_text("{}", encoding="utf-8")
    code, report = run(tmp, BASE_POLICY)
    assert code == 2
    assert report["metrics"]["nested_agent_config_roots"] == 1


def test_allowlisted_repo_without_hooks_passes(tmp: Path):
    (tmp / ".git").mkdir()
    nested_root = tmp / "vendor" / "dep"
    (nested_root / ".git").mkdir(parents=True)
    policy = json.loads(BASE_POLICY.read_text(encoding="utf-8"))
    policy["nested_root_allowlist"] = ["vendor/dep"]
    p = tmp / "policy.json"
    p.write_text(json.dumps(policy), encoding="utf-8")
    code, report = run(tmp, p)
    assert code == 0
    assert report["metrics"]["violations"] == 0


def main():
    tests = [test_clean_workspace_passes, test_nested_repo_blocks, test_active_nested_hook_detected, test_nested_agent_settings_block, test_allowlisted_repo_without_hooks_passes]
    for test in tests:
        with tempfile.TemporaryDirectory() as d:
            test(Path(d))
        print(f"PASS {test.__name__}")
    print(f"PASS {len(tests)} tests")

if __name__ == "__main__":
    main()
