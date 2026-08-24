import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "carry_cost_profiler.py"


def run(events, cfg):
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        trace = td / "trace.jsonl"
        config = td / "budget.json"
        trace.write_text("\n".join(json.dumps(e) for e in events) + "\n", encoding="utf-8")
        config.write_text(json.dumps(cfg), encoding="utf-8")
        return subprocess.run([sys.executable, str(SCRIPT), str(trace), "--config", str(config)], text=True, capture_output=True)


def test_early_result_accumulates_carry_cost():
    events = [
        {"type":"tool_result","turn":1,"id":"a","tokens":100,"tool":"search"},
        {"type":"model_turn","turn":2},
        {"type":"model_turn","turn":3}
    ]
    r = run(events, {"max_cumulative_carry_tokens":1000})
    assert r.returncode == 0, r.stderr
    data = json.loads(r.stdout)
    assert data["direct_tool_result_tokens"] == 100
    assert data["cumulative_carry_tokens"] == 200
    assert data["carry_amplification_ratio"] == 3.0


def test_eviction_stops_future_carry():
    events = [
        {"type":"tool_result","turn":1,"id":"a","tokens":100},
        {"type":"model_turn","turn":2},
        {"type":"evict","turn":2,"id":"a"},
        {"type":"model_turn","turn":3}
    ]
    r = run(events, {"max_cumulative_carry_tokens":1000})
    data = json.loads(r.stdout)
    assert data["cumulative_carry_tokens"] == 100


def test_budget_failure_exit_code():
    events = [
        {"type":"tool_result","turn":1,"id":"a","tokens":500},
        {"type":"model_turn","turn":2},
        {"type":"model_turn","turn":3}
    ]
    r = run(events, {"max_cumulative_carry_tokens":900,"max_carry_amplification_ratio":10})
    assert r.returncode == 2
    assert json.loads(r.stdout)["status"] == "fail"


def test_invalid_duplicate_id_is_rejected():
    events = [
        {"type":"tool_result","turn":1,"id":"a","tokens":10},
        {"type":"tool_result","turn":2,"id":"a","tokens":10}
    ]
    r = run(events, {})
    assert r.returncode == 3
