import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "context_checkpoint_guard.py"
POLICY = ROOT / "config" / "policy.json"
EXAMPLE = ROOT / "examples" / "checkpoint.json"


def run_guard(path: Path):
    return subprocess.run(
        [sys.executable, str(SCRIPT), str(path), "--policy", str(POLICY), "--json"],
        text=True,
        capture_output=True,
        check=False,
    )


def test_valid_example_passes():
    result = run_guard(EXAMPLE)
    assert result.returncode == 0, result.stderr + result.stdout
    payload = json.loads(result.stdout)
    assert payload["status"] == "pass"
    assert payload["errors"] == []


def test_missing_next_action_fails(tmp_path):
    data = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    data["state"]["next_action"] = ""
    path = tmp_path / "bad.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    result = run_guard(path)
    assert result.returncode == 2
    payload = json.loads(result.stdout)
    assert payload["status"] == "fail"
    assert any("next_action" in e for e in payload["errors"])


def test_fact_without_evidence_fails(tmp_path):
    data = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    del data["evidence"]["facts"][0]["evidence"]
    path = tmp_path / "bad.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    result = run_guard(path)
    assert result.returncode == 2
    assert "needs statement and evidence" in result.stdout


def test_secret_like_key_fails(tmp_path):
    data = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    data["execution"]["active_resources"][0]["api_token"] = "not-a-real-secret"
    path = tmp_path / "bad.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    result = run_guard(path)
    assert result.returncode == 2
    assert "secret-like key forbidden" in result.stdout


def test_active_resource_requires_id(tmp_path):
    data = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    del data["execution"]["active_resources"][0]["id"]
    path = tmp_path / "bad.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    result = run_guard(path)
    assert result.returncode == 2
    assert "missing id" in result.stdout
