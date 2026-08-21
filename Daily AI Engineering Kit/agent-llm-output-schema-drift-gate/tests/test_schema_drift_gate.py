import importlib.util
from pathlib import Path

MODULE = Path(__file__).resolve().parents[1] / "scripts" / "schema_drift_gate.py"
spec = importlib.util.spec_from_file_location("gate", MODULE)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def test_no_drift():
    schema={"type":"object","properties":{"id":{"type":"string"}},"required":["id"]}
    assert gate.compare(schema, schema) == []


def test_removed_field_is_breaking():
    old={"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"}},"required":["id"]}
    new={"type":"object","properties":{"id":{"type":"string"}},"required":["id"]}
    findings=gate.compare(old,new)
    assert any(x["kind"]=="field_removed" and x["path"]=="$.name" for x in findings)


def test_required_added_is_breaking():
    old={"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"}},"required":["id"]}
    new={"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"}},"required":["id","name"]}
    assert any(x["kind"]=="required_added" for x in gate.compare(old,new))


def test_enum_expansion_warn_only():
    old={"type":"string","enum":["a"]}
    new={"type":"string","enum":["a","b"]}
    findings=gate.compare(old,new)
    assert findings == [{"kind":"enum_expanded","path":"$","added":["b"]}]
