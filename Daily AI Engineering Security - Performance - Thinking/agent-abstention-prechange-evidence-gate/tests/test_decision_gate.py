import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "decision_gate.py"
spec = importlib.util.spec_from_file_location("decision_gate", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)


def base(decision="change-required"):
    return {
        "decision": decision,
        "facts": ["current behavior observed"],
        "assumptions": [],
        "evidence": ["test output", "git history"],
        "hypotheses": ["issue remains"],
        "risks": ["regression"],
        "verification_status": "reviewed",
        "partial_fix_checked": True,
    }


def test_change_required_passes():
    assert mod.validate(base())[0] == 0


def test_no_change_blocks_write():
    assert mod.validate(base("no-change"))[0] == 4


def test_insufficient_evidence_blocks():
    assert mod.validate(base("insufficient-evidence"))[0] == 3


def test_requires_two_evidence_items():
    data = base()
    data["evidence"] = ["only one"]
    assert mod.validate(data)[0] == 3


def test_requires_partial_fix_check():
    data = base()
    data["partial_fix_checked"] = False
    assert mod.validate(data)[0] == 3


def test_unresolved_contradiction_blocks():
    data = base()
    data["contradictions"] = ["test and runtime disagree"]
    assert mod.validate(data)[0] == 5
