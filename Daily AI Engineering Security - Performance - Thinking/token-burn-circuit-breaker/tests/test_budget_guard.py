import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "budget_guard.py"
POLICY = ROOT / "config" / "budget-policy.json"


def run(events):
    with tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False, encoding="utf-8") as f:
        for e in events:
            f.write(json.dumps(e) + "\n")
        name = f.name
    p = subprocess.run([sys.executable, str(SCRIPT), name, "--policy", str(POLICY)], capture_output=True, text=True)
    Path(name).unlink(missing_ok=True)
    return p.returncode, json.loads(p.stdout or p.stderr)


def event(inp, out, ts, source="parent", retry=False, progress=None):
    return {"task_id":"t1","source":source,"input_tokens":inp,"output_tokens":out,"cached_tokens":0,"estimated_cost_usd":0.01,"retry":retry,"progress_marker":progress,"timestamp":ts}


def test_good_ledger_allows():
    code, body = run([event(5000,1000,"2026-08-21T10:00:00Z",progress="issue_narrowed"), event(6000,1000,"2026-08-21T10:05:00Z")])
    assert code == 0 and body["decision"] == "allow"


def test_retry_ratio_stops():
    code, body = run([event(10000,1000,"2026-08-21T10:00:00Z"), event(10000,1000,"2026-08-21T10:01:00Z",source="retry",retry=True)])
    assert code == 4 and body["decision"] == "stop"
    assert any("retry_token_ratio" in x for x in body["reasons"])


def test_no_progress_stops():
    code, body = run([event(35000,0,"2026-08-21T10:00:00Z"), event(30000,0,"2026-08-21T10:10:00Z")])
    assert code == 4 and body["decision"] == "stop"
    assert any("no_progress_tokens" in x for x in body["reasons"])
