import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "backpressure_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def test_number_accepts_non_negative_values():
    assert guard.number({"x": 3}, "x") == 3.0


def test_number_rejects_negative_values():
    try:
        guard.number({"x": -1}, "x")
        assert False, "expected ValueError"
    except ValueError:
        pass


def test_number_rejects_boolean():
    try:
        guard.number({"x": True}, "x")
        assert False, "expected ValueError"
    except ValueError:
        pass
