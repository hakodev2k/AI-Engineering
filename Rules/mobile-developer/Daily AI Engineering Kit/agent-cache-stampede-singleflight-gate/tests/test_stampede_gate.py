import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "stampede_gate.py"

def run(tmp_path, data):
    p = tmp_path / "evidence.json"
    p.write_text(json.dumps(data), encoding="utf-8")
    return subprocess.run([sys.executable, str(SCRIPT), str(p)], capture_output=True, text=True)

def base():
    return {
        "key": "product:42",
        "concurrent_callers": 50,
        "origin_calls": 1,
        "max_wait_ms": 900,
        "lock_timeout_ms": 5000,
        "load_timeout_ms": 30000,
        "all_waiters_completed": True,
        "leader_failure_released": True
    }

def test_pass(tmp_path):
    result = run(tmp_path, base())
    assert result.returncode == 0
    assert '"status": "pass"' in result.stdout

def test_duplicate_origin_calls_fail(tmp_path):
    data = base(); data["origin_calls"] = 5
    result = run(tmp_path, data)
    assert result.returncode == 1

def test_stuck_waiter_fails(tmp_path):
    data = base(); data["all_waiters_completed"] = False
    result = run(tmp_path, data)
    assert result.returncode == 1

def test_missing_field_is_invalid(tmp_path):
    data = base(); data.pop("key")
    result = run(tmp_path, data)
    assert result.returncode == 2
