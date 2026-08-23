import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "burst_budget.py"
spec = importlib.util.spec_from_file_location("burst_budget", MODULE)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

POLICY={"window_seconds":60,"max_calls_per_window":3,"max_poll_calls_per_window":1,"max_estimated_input_tokens_per_window":1000,"max_calls_per_turn":5,"approved_fanout_bonus":2,"recovery_cooldown_seconds":30}

def event(i, cls="progress", tokens=100, approved=False):
    return {"timestamp":float(i),"_ts":float(i),"tool":f"t{i}","class":cls,"estimated_input_tokens":tokens,"approved_fanout":approved}

def test_allows_productive_calls():
    assert mod.analyze([event(1),event(2)],POLICY)["decision"] == "allow"

def test_defers_poll_burst():
    r=mod.analyze([event(1,"poll"),event(2,"retry")],POLICY)
    assert r["decision"] == "defer" and r["reason"] == "poll_retry_window_exceeded"

def test_approved_fanout_adds_only_bounded_bonus():
    rows=[event(1,"fanout",approved=True),event(2),event(3),event(4),event(5)]
    assert mod.analyze(rows,POLICY)["decision"] == "allow"
    rows.append(event(6))
    assert mod.analyze(rows,POLICY)["decision"] == "block"

def test_token_window_defer():
    r=mod.analyze([event(1,tokens=700),event(2,tokens=400)],POLICY)
    assert r["reason"] == "token_window_exceeded"
