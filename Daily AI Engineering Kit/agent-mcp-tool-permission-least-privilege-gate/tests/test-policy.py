import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "check-permissions.py"
POLICY = ROOT / "config" / "policy.json"


def run(payload, tmp_path):
    request_file = tmp_path / "requests.json"
    request_file.write_text(json.dumps(payload), encoding="utf-8")
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--policy", str(POLICY), "--requests", str(request_file)],
        capture_output=True,
        text=True,
    )


def test_allows_known_read_scope(tmp_path):
    payload = {"requests": [{
        "task_id": "t1", "agent": "reader", "tool": "github.issue.read",
        "scope": "issues.read", "action": "read", "risk": "read",
        "resource": "owner/repo#1", "justification": "Collect issue evidence",
        "expires_after_task": True, "approval_id": None
    }]}
    result = run(payload, tmp_path)
    assert result.returncode == 0, result.stderr


def test_denies_write_without_approval(tmp_path):
    payload = {"requests": [{
        "task_id": "t2", "agent": "writer", "tool": "github.file.write",
        "scope": "repository.write", "action": "write", "risk": "write",
        "resource": "owner/repo:path", "justification": "Apply requested code change",
        "expires_after_task": True, "approval_id": None
    }]}
    result = run(payload, tmp_path)
    assert result.returncode == 1
    assert "requires approval" in result.stderr


def test_denies_wildcard_scope(tmp_path):
    payload = {"requests": [{
        "task_id": "t3", "agent": "reader", "tool": "generic.read",
        "scope": "repository.*", "action": "read", "risk": "read",
        "resource": "owner/repo", "justification": "Inspect repository evidence",
        "expires_after_task": True, "approval_id": None
    }]}
    result = run(payload, tmp_path)
    assert result.returncode == 1
    assert "wildcard" in result.stderr.lower()
