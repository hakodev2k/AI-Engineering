import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "tool_call_gate.py"
POLICY = ROOT / "config" / "tool-policy.json"


def run(payload):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(payload, f)
        name = f.name
    p = subprocess.run([sys.executable, str(SCRIPT), name, "--policy", str(POLICY)], capture_output=True, text=True)
    Path(name).unlink(missing_ok=True)
    return p.returncode, json.loads(p.stdout or p.stderr)


def envelope(**overrides):
    e = {"call_id":"c1","tool_name":"write_file","arguments":{"path":"a.txt","content":"ok"},"stream_state":"complete","terminal_event_seen":True,"finish_reason":"tool_calls","schema_valid":True,"authorized":True,"risk_class":"side_effect","idempotency_key":"task:c1","postcondition_verified":False,"execution_outcome":"not_started"}
    e.update(overrides)
    return e


def test_complete_authorized_call_ready():
    code, body = run(envelope())
    assert code == 0 and body["decision"] == "ready"


def test_partial_never_ready():
    code, body = run(envelope(stream_state="partial", terminal_event_seen=False))
    assert code == 3 and body["decision"] == "partial"


def test_empty_arguments_denied():
    code, body = run(envelope(arguments={}))
    assert code == 5 and body["decision"] == "deny"


def test_unknown_side_effect_reconciles():
    code, body = run(envelope(stream_state="unknown", execution_outcome="unknown"))
    assert code == 4 and body["decision"] == "reconcile"


def test_committed_requires_postcondition():
    code, body = run(envelope(stream_state="committed", execution_outcome="success", postcondition_verified=False))
    assert code == 4 and body["decision"] == "reconcile"
    code, body = run(envelope(stream_state="committed", execution_outcome="success", postcondition_verified=True))
    assert code == 0 and body["decision"] == "committed"
