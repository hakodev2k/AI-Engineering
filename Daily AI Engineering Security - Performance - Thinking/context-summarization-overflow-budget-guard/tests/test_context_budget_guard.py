import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "context_budget_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def test_num_accepts_non_negative_number():
    assert guard.num({"x": 5}, "x") == 5.0


def test_num_rejects_negative_number():
    try:
        guard.num({"x": -1}, "x")
        assert False, "expected ValueError"
    except ValueError:
        pass


def test_num_rejects_boolean():
    try:
        guard.num({"x": True}, "x")
        assert False, "expected ValueError"
    except ValueError:
        pass
