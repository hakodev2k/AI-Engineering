import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "check_cardinality.py"
spec = importlib.util.spec_from_file_location("check_cardinality", MODULE)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


def test_parallel_success_complete():
    data = {"calls": [
        {"call_id": "a", "terminal_dispositions": ["success"], "persisted": True, "sent": True},
        {"call_id": "b", "terminal_dispositions": ["error"], "persisted": True, "sent": True},
    ]}
    assert mod.validate(data)["decision"] == "complete"


def test_missing_terminal_blocks():
    data = {"calls": [
        {"call_id": "a", "terminal_dispositions": ["success"]},
        {"call_id": "b", "terminal_dispositions": []},
    ]}
    report = mod.validate(data)
    assert report["decision"] == "block"
    assert any("missing_terminal" in x for x in report["violations"])


def test_duplicate_terminal_blocks():
    data = {"calls": [{"call_id": "a", "terminal_dispositions": ["success", "error"]}]}
    assert mod.validate(data)["decision"] == "block"


def test_rejected_cannot_be_success():
    data = {"calls": [{"call_id": "a", "terminal_dispositions": ["success"], "rejected": True}]}
    report = mod.validate(data)
    assert any("rejected_marked_success" in x for x in report["violations"])


def test_explicit_interruption_can_defer_terminal():
    data = {"calls": [{"call_id": "a", "terminal_dispositions": [], "interrupted": True}]}
    assert mod.validate(data)["decision"] == "complete"


def test_duplicate_call_ids_block():
    data = {"calls": [
        {"call_id": "a", "terminal_dispositions": ["success"]},
        {"call_id": "a", "terminal_dispositions": ["success"]},
    ]}
    assert mod.validate(data)["decision"] == "block"
