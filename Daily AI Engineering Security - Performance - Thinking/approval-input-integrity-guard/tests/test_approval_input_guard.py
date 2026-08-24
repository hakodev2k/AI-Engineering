import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "approval_input_guard.py"

def run(a, e=None):
    with tempfile.TemporaryDirectory() as d:
        ap = Path(d)/"a.json"; ap.write_text(json.dumps(a), encoding="utf-8")
        cmd=[sys.executable,str(SCRIPT),"--approval",str(ap)]
        if e is not None:
            ep=Path(d)/"e.json"; ep.write_text(json.dumps(e), encoding="utf-8"); cmd += ["--execution",str(ep)]
        return subprocess.run(cmd,capture_output=True,text=True)

def test_same_semantics_different_key_order_allows():
    r=run({"tool":"write","arguments":{"b":2,"a":1}}, {"arguments":{"a":1,"b":2},"tool":"write"})
    assert r.returncode == 0 and "ALLOW" in r.stdout

def test_argument_mutation_blocks():
    r=run({"tool":"pay","arguments":{"amount":10}}, {"tool":"pay","arguments":{"amount":1000}})
    assert r.returncode == 4 and "BLOCK" in r.stdout

def test_tool_identity_mutation_blocks():
    r=run({"tool":"read","arguments":{"path":"x"}}, {"tool":"delete","arguments":{"path":"x"}})
    assert r.returncode == 4

def test_missing_arguments_fail_closed():
    r=run({"tool":"write"})
    assert r.returncode == 2
