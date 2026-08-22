import json
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "analyze_overhead.py"
POLICY = Path(__file__).parents[1] / "config" / "policy.json"


def write_jsonl(path: Path, rows):
    path.write_text("\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8")


def run(tmp_path, candidate_rows, baseline_rows=None):
    candidate = tmp_path / "candidate.jsonl"
    write_jsonl(candidate, candidate_rows)
    cmd = [sys.executable, str(SCRIPT), str(candidate), "--policy", str(POLICY), "--strict"]
    if baseline_rows is not None:
        baseline = tmp_path / "baseline.jsonl"
        write_jsonl(baseline, baseline_rows)
        cmd += ["--baseline", str(baseline)]
    return subprocess.run(cmd, capture_output=True, text=True)


def event(turn, round_, provider, fp, ms, status="ok"):
    return {"turn_id": turn, "approval_round": round_, "provider": provider, "input_fingerprint": fp, "duration_ms": ms, "status": status}


def test_detects_repeated_work(tmp_path):
    result = run(tmp_path, [event("t1", 0, "rag", "x", 10), event("t1", 1, "rag", "x", 11)])
    assert result.returncode == 0
    report = json.loads(result.stdout)
    assert report["candidate"]["repeated_provider_invocations"] == 1


def test_candidate_with_less_repeated_work_passes(tmp_path):
    baseline = [event("t1", 0, "rag", "x", 20), event("t1", 1, "rag", "x", 20), event("t1", 2, "rag", "x", 20)]
    candidate = [event("t1", 0, "rag", "x", 20)]
    result = run(tmp_path, candidate, baseline)
    assert result.returncode == 0, result.stderr + result.stdout
    assert json.loads(result.stdout)["status"] == "pass"


def test_increased_errors_fail_strict(tmp_path):
    baseline = [event("t1", 0, "rag", "x", 10)]
    candidate = [event("t1", 0, "rag", "x", 10, "error")]
    result = run(tmp_path, candidate, baseline)
    assert result.returncode == 3
