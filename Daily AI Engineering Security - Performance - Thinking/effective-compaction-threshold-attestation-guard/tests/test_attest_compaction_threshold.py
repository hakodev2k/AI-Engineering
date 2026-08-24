import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "attest_compaction_threshold.py"

def run(payload):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"input.json"; p.write_text(json.dumps(payload),encoding="utf-8")
        return subprocess.run([sys.executable,str(SCRIPT),str(p)],capture_output=True,text=True)

def test_matching_ratio_passes():
    r=run({"effective_context_tokens":200000,"effective_threshold_tokens":120000,"configured_ratio":0.6})
    assert r.returncode == 0 and '"status": "PASS"' in r.stdout

def test_silent_clamp_detected():
    r=run({"effective_context_tokens":262144,"effective_threshold_tokens":196608,"configured_ratio":0.6,"max_ratio_delta":0.05})
    assert r.returncode == 2 and '"status": "BLOCK"' in r.stdout

def test_absolute_ceiling_blocks_large_window_ratio():
    r=run({"effective_context_tokens":1000000,"effective_threshold_tokens":500000,"configured_ratio":0.5,"max_threshold_tokens":250000})
    assert r.returncode == 2 and "absolute ceiling" in r.stdout

def test_threshold_above_context_blocks():
    r=run({"effective_context_tokens":100000,"effective_threshold_tokens":120000,"configured_ratio":0.8})
    assert r.returncode == 2
