import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "latency_attribution.py"
spec = importlib.util.spec_from_file_location("latency_attribution", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


def test_approval_wait_is_not_execution():
    result = mod.profile({
        "call_id": "c1",
        "call_created_ms": 0,
        "approval_requested_ms": 100,
        "approval_resolved_ms": 120100,
        "execution_start_ms": 120100,
        "execution_end_ms": 131100,
        "continuation_end_ms": 132100,
    })
    assert result["ok"]
    assert result["approval_wait_ms"] == 120000
    assert result["tool_execution_ms"] == 11000
    assert result["wall_clock_ms"] == 132100


def test_invalid_phase_order_blocks_evidence():
    result = mod.profile({
        "call_created_ms": 0,
        "approval_requested_ms": 10,
        "approval_resolved_ms": 100,
        "execution_start_ms": 50,
        "execution_end_ms": 200,
    })
    assert not result["ok"]
    assert not result["execution_evidence_valid"]


def test_ungated_tool_execution_is_supported():
    result = mod.profile({
        "call_created_ms": 0,
        "execution_start_ms": 5,
        "execution_end_ms": 25,
        "continuation_end_ms": 40,
    })
    assert result["ok"]
    assert result["approval_wait_ms"] == 0
    assert result["tool_execution_ms"] == 20
    assert result["continuation_ms"] == 15


def test_partial_approval_timestamps_are_rejected():
    result = mod.profile({
        "call_created_ms": 0,
        "approval_requested_ms": 10,
        "execution_start_ms": 20,
        "execution_end_ms": 30,
    })
    assert not result["ok"]
    assert any("provided together" in e for e in result["errors"])
