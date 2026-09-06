import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "channel_guard.py"
spec = importlib.util.spec_from_file_location("channel_guard", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)

POLICY = {
    "approved_coordination_prefixes": ["broker://approved/"],
    "ignored_readonly_prefixes": ["dataset://public/"],
    "window_events": 100,
}


def test_writer_then_peer_reader_is_violation():
    events = [
        {"agent_id": "a", "resource": "cache://shared/msg1", "operation": "write"},
        {"agent_id": "b", "resource": "cache://shared/msg1", "operation": "read"},
    ]
    report = mod.analyze(events, POLICY)
    assert report["unapproved_cross_agent_edges"] == 1


def test_two_writers_same_namespace_is_violation():
    events = [
        {"agent_id": "a", "resource": "cache://shared/a", "operation": "create"},
        {"agent_id": "b", "resource": "cache://shared/b", "operation": "create"},
    ]
    report = mod.analyze(events, POLICY)
    assert report["unapproved_cross_agent_edges"] == 1


def test_same_agent_activity_is_not_cross_agent():
    events = [
        {"agent_id": "a", "resource": "cache://shared/a", "operation": "write"},
        {"agent_id": "a", "resource": "cache://shared/a", "operation": "read"},
    ]
    assert mod.analyze(events, POLICY)["unapproved_cross_agent_edges"] == 0


def test_approved_broker_is_allowed():
    events = [
        {"agent_id": "a", "resource": "broker://approved/thread/a", "operation": "write"},
        {"agent_id": "b", "resource": "broker://approved/thread/a", "operation": "read"},
    ]
    assert mod.analyze(events, POLICY)["unapproved_cross_agent_edges"] == 0


def test_public_readonly_data_is_allowed_when_never_written():
    events = [
        {"agent_id": "a", "resource": "dataset://public/base/file", "operation": "read"},
        {"agent_id": "b", "resource": "dataset://public/base/file", "operation": "read"},
    ]
    assert mod.analyze(events, POLICY)["unapproved_cross_agent_edges"] == 0


def test_write_to_declared_readonly_prefix_is_violation():
    events = [
        {"agent_id": "a", "resource": "dataset://public/base/message", "operation": "write"},
    ]
    report = mod.analyze(events, POLICY)
    assert report["unapproved_cross_agent_edges"] == 1
    assert report["violations"][0]["reason"] == "write-to-declared-readonly-prefix"
