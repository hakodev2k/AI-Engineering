import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "oracle_probe_audit.py"
CONFIG = ROOT / "config" / "protected-surface.example.json"


def run(lines):
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "t.jsonl"
        p.write_text("\n".join(json.dumps(x) for x in lines) + "\n", encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), str(p), "--config", str(CONFIG)], text=True, capture_output=True)


def test_safe_public_denial_passes():
    r = run([{"sequence_id":"s1","denied":True,"reason_code":"ACTION_NOT_ALLOWED","response":"I cannot perform that action. You can choose a supported operation instead."}])
    assert r.returncode == 0, r.stdout + r.stderr


def test_protected_literal_blocks():
    r = run([{"sequence_id":"s1","denied":True,"response":"The internal_autosend_parameter is disabled."}])
    assert r.returncode == 2
    assert "literal:internal_autosend_parameter" in r.stdout


def test_sensitive_pattern_blocks():
    r = run([{"sequence_id":"s1","denied":True,"response":"This is an undocumented parameter that the old protection disabled."}])
    assert r.returncode == 2


def test_nonpublic_reason_code_blocks():
    r = run([{"sequence_id":"s1","denied":True,"reason_code":"INTERNAL_ROUTE_X7","response":"Request denied."}])
    assert r.returncode == 2
    assert "nonpublic_reason_code:INTERNAL_ROUTE_X7" in r.stdout
