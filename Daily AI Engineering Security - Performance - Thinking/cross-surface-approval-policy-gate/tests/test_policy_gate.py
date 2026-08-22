import hashlib
import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "policy_gate.py"
POLICY = Path(__file__).parents[1] / "config" / "policy.json"


def digest(args):
    raw = json.dumps(args, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def run(tmp_path, request):
    path = tmp_path / "request.json"
    path.write_text(json.dumps(request), encoding="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), str(path), "--policy", str(POLICY), "--strict"], capture_output=True, text=True)


def base(capability="filesystem_sensitive_write", impact="high"):
    return {"surface": "file", "capability": capability, "target": "~/.bashrc", "actor": "session-1", "impact": impact, "args": {"path": "~/.bashrc", "content": "safe-test"}}


def test_high_impact_requires_approval(tmp_path):
    result = run(tmp_path, base())
    assert result.returncode == 4


def test_bound_approval_allows(tmp_path):
    request = base()
    request["approval"] = {"granted": True, "actor": request["actor"], "capability": request["capability"], "target": request["target"], "argument_sha256": digest(request["args"])}
    result = run(tmp_path, request)
    assert result.returncode == 0, result.stderr + result.stdout


def test_changed_arguments_invalidate_approval(tmp_path):
    request = base()
    request["approval"] = {"granted": True, "actor": request["actor"], "capability": request["capability"], "target": request["target"], "argument_sha256": digest(request["args"])}
    request["args"]["content"] = "changed"
    result = run(tmp_path, request)
    assert result.returncode == 4


def test_missing_delegation_provenance_denies(tmp_path):
    request = base()
    request["delegated"] = True
    result = run(tmp_path, request)
    assert result.returncode == 5


def test_unknown_high_impact_denies(tmp_path):
    request = base("unmapped_admin_action", "high")
    result = run(tmp_path, request)
    assert result.returncode == 5
