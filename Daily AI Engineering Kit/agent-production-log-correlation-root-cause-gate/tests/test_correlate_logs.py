import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "correlate_logs.py"
SAMPLE = ROOT / "examples" / "sample-logs.jsonl"


def run(tmp_path, *extra):
    out = tmp_path / "evidence.json"
    cmd = [
        sys.executable,
        str(SCRIPT),
        "--input", str(SAMPLE),
        "--start", "2026-08-21T07:59:00Z",
        "--end", "2026-08-21T08:01:00Z",
        "--key", "trace_id",
        "--value", "trace-123",
        "--output", str(out),
        *extra,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result, out


def test_correlates_and_finds_first_abnormal(tmp_path):
    result, out = run(tmp_path)
    assert result.returncode == 0, result.stderr
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data["status"] == "ready"
    assert len(data["events"]) == 4
    first = data["first_abnormal_event"]
    event = next(e for e in data["events"] if e["id"] == first)
    assert event["service"] == "payments"
    assert "Timeout" in event["message"]


def test_redacts_secret_fields(tmp_path):
    result, out = run(tmp_path)
    assert result.returncode == 0
    text = out.read_text(encoding="utf-8")
    assert "Bearer" not in text
    assert "authorization" not in text.lower() or "[REDACTED]" in text


def test_invalid_time_window_fails(tmp_path):
    out = tmp_path / "evidence.json"
    cmd = [sys.executable, str(SCRIPT), "--input", str(SAMPLE), "--start", "2026-08-21T09:00:00Z", "--end", "2026-08-21T08:00:00Z", "--output", str(out)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    assert result.returncode == 1
    assert "end must be after start" in result.stderr
