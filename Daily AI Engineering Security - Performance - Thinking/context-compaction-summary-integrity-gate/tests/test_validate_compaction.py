import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "validate_compaction.py"
spec = importlib.util.spec_from_file_location("validate_compaction", MODULE)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


def base_source():
    return {
        "session_id": "s1",
        "source_message_ids": ["m1", "m2", "m3"],
        "critical_facts": ["goal=g1", "constraint=no-force", "decision=approved-a"],
        "watermark": 42,
        "task_status": "completed",
        "language": "en",
    }


def valid_candidate():
    return {
        "session_id": "s1",
        "source_message_ids": ["m1", "m2", "m3"],
        "preserved_facts": ["goal=g1", "constraint=no-force", "decision=approved-a"],
        "watermark": 42,
        "reference_only": True,
        "task_status": "completed",
        "language": "en",
    }


def test_valid_candidate_allowed():
    report = mod.validate(base_source(), valid_candidate())
    assert report["decision"] == "allow"
    assert report["critical_fact_recall"] == 1.0


def test_cross_session_rejected():
    c = valid_candidate(); c["session_id"] = "other"
    assert "session_id_mismatch" in mod.validate(base_source(), c)["violations"]


def test_unknown_source_id_rejected():
    c = valid_candidate(); c["source_message_ids"].append("fabricated")
    report = mod.validate(base_source(), c)
    assert report["decision"] == "reject"
    assert any(x.startswith("unknown_source_message_ids") for x in report["violations"])


def test_missing_critical_fact_rejected():
    c = valid_candidate(); c["preserved_facts"].remove("constraint=no-force")
    report = mod.validate(base_source(), c)
    assert report["decision"] == "reject"
    assert report["critical_fact_recall"] < 1.0


def test_completed_task_cannot_reopen():
    c = valid_candidate(); c["task_status"] = "pending"
    assert "completed_task_reopened" in mod.validate(base_source(), c)["violations"]


def test_language_drift_rejected():
    c = valid_candidate(); c["language"] = "nl"
    assert "language_drift" in mod.validate(base_source(), c)["violations"]
