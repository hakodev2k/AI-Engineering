import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "replay_guard.py"

def run(data):
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / "e.json"; p.write_text(json.dumps(data), encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), "--evidence", str(p)], capture_output=True, text=True)

def test_matching_input_passes():
    r = run({"required_fields":["query","tenant"],"dispatch":{"query":"x","tenant":7},"resume":{"query":"x","tenant":7}})
    assert r.returncode == 0 and json.loads(r.stdout)["status"] == "PASS"

def test_missing_ephemeral_input_blocks():
    r = run({"required_fields":["query","tenant"],"dispatch":{"query":"x","tenant":7},"resume":{"query":"x"}})
    assert r.returncode == 2 and "tenant" in json.loads(r.stdout)["missing"]

def test_changed_input_blocks():
    r = run({"required_fields":["query"],"dispatch":{"query":{"k":1}},"resume":{"query":{"k":2}}})
    assert r.returncode == 2 and "query" in json.loads(r.stdout)["mismatched"]
