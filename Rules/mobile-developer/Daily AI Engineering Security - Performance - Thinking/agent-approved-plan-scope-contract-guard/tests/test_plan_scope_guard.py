import importlib.util
import json
import subprocess
from pathlib import Path

MODULE_PATH = Path(__file__).parents[1] / "scripts" / "plan_scope_guard.py"
spec = importlib.util.spec_from_file_location("plan_scope_guard", MODULE_PATH)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def contract():
    return {
        "contract_id": "placeholder",
        "version": 1,
        "goal": "change pricing only",
        "allowed_paths": ["src/pricing/**", "tests/pricing/**"],
        "forbidden_paths": ["src/auth/**", ".github/**"],
        "allowed_operation_classes": ["read", "edit", "create", "test"],
        "acceptance_criteria": ["pricing tests pass"],
        "invariants": ["auth unchanged"],
        "baseline_ref": "HEAD",
        "approved_by": "user",
        "approved_at": "2026-08-20T08:00:00+07:00",
    }


def git(repo, *args):
    subprocess.run(["git", "-C", str(repo), *args], check=True, text=True, capture_output=True)


def test_allows_in_scope_edit(tmp_path):
    ok, detail = guard.check_scope(contract(), tmp_path, "edit", "src/pricing/Price.cs")
    assert ok
    assert detail == "src/pricing/Price.cs"


def test_blocks_adjacent_scope(tmp_path):
    ok, detail = guard.check_scope(contract(), tmp_path, "edit", "src/orders/Order.cs")
    assert not ok
    assert "outside allowed scope" in detail


def test_forbidden_overrides_other_scope(tmp_path):
    c = contract()
    c["allowed_paths"].append("src/**")
    ok, detail = guard.check_scope(c, tmp_path, "edit", "src/auth/Auth.cs")
    assert not ok
    assert "forbidden" in detail


def test_blocks_unapproved_operation(tmp_path):
    ok, detail = guard.check_scope(contract(), tmp_path, "delete", "src/pricing/Price.cs")
    assert not ok
    assert "operation" in detail


def test_blocks_path_escape(tmp_path):
    ok, detail = guard.check_scope(contract(), tmp_path, "edit", "../outside.txt")
    assert not ok
    assert "outside repository" in detail


def test_cumulative_verify_detects_unplanned_file(tmp_path):
    repo = tmp_path / "repo"
    repo.mkdir()
    git(repo, "init")
    git(repo, "config", "user.email", "test@example.com")
    git(repo, "config", "user.name", "Test")
    (repo / "src/pricing").mkdir(parents=True)
    (repo / "src/orders").mkdir(parents=True)
    (repo / "src/pricing/Price.cs").write_text("v1\n")
    (repo / "src/orders/Order.cs").write_text("v1\n")
    git(repo, "add", ".")
    git(repo, "commit", "-m", "baseline")
    (repo / "src/pricing/Price.cs").write_text("v2\n")
    (repo / "src/orders/Order.cs").write_text("v2\n")
    changed = guard.current_changed_files(repo, "HEAD")
    violations = []
    c = contract()
    for path in changed:
        norm = guard.normalize_repo_path(repo, path)
        if norm is None or guard.matches(norm, c["forbidden_paths"]) or not guard.matches(norm, c["allowed_paths"]):
            violations.append(path)
    assert "src/orders/Order.cs" in violations
    assert "src/pricing/Price.cs" not in violations


def test_contract_hash_is_stable():
    c = contract()
    c.pop("contract_id")
    assert guard.contract_hash(c) == guard.contract_hash(json.loads(json.dumps(c)))
