import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "review_gate.py"


def run(payload, tmp_path):
    p = tmp_path / "resolution.json"
    p.write_text(json.dumps(payload), encoding="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), "--input", str(p)], capture_output=True, text=True)


def valid():
    return {
        "pull_request": 1,
        "comments": [{
            "comment_id": 10,
            "status": "resolved",
            "finding": "Bug reproduced",
            "evidence": ["test output"],
            "action": "Fixed validation",
            "files": ["a.py"]
        }],
        "verification": ["tests pass"],
        "status": "verified"
    }


def test_valid_payload_passes(tmp_path):
    result = run(valid(), tmp_path)
    assert result.returncode == 0, result.stderr


def test_missing_evidence_fails(tmp_path):
    payload = valid()
    payload["comments"][0]["evidence"] = []
    result = run(payload, tmp_path)
    assert result.returncode == 1


def test_verified_cannot_contain_blocked(tmp_path):
    payload = valid()
    payload["comments"][0]["status"] = "blocked"
    result = run(payload, tmp_path)
    assert result.returncode == 1
