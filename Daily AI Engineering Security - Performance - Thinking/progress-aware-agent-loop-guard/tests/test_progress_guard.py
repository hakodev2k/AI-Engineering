import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "progress_guard.py"
spec = importlib.util.spec_from_file_location("progress_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


class ProgressGuardTests(unittest.TestCase):
    def cfg(self):
        c = dict(mod.DEFAULTS)
        c.update({
            "max_total_steps": 20,
            "max_exact_repeat_streak": 3,
            "max_cycle_period": 3,
            "max_cycle_repetitions": 3,
            "max_stagnant_state_steps": 4,
            "side_effecting_tools": ["send"],
        })
        return c

    def test_exact_repeat_stops(self):
        rows = [{"tool": "search", "args": {"q": "x"}, "result": []} for _ in range(3)]
        report = mod.analyze(rows, self.cfg())
        self.assertEqual(report["decision"], "stop")
        self.assertIn("exact_repeat", [r["type"] for r in report["reasons"]])

    def test_short_cycle_stops(self):
        rows = []
        for i in range(3):
            rows += [
                {"tool": "lookup", "args": {"id": 1}, "result": "a", "state_fingerprint": str(i)},
                {"tool": "parse", "args": {"id": 1}, "result": "b", "state_fingerprint": str(i)},
            ]
        report = mod.analyze(rows, self.cfg())
        self.assertIn("short_cycle", [r["type"] for r in report["reasons"]])

    def test_productive_repeated_tool_allowed(self):
        rows = [
            {"tool": "search", "args": {"page": i}, "result": [i], "state_fingerprint": f"page-{i}"}
            for i in range(1, 5)
        ]
        self.assertEqual(mod.analyze(rows, self.cfg())["decision"], "continue")

    def test_side_effect_retry_without_state_change_stops(self):
        rows = [
            {"tool": "send", "args": {"to": "fixture@example.invalid"}, "result": "ok", "state_fingerprint": "s1"},
            {"tool": "send", "args": {"to": "fixture@example.invalid"}, "result": "ok", "state_fingerprint": "s1"},
        ]
        report = mod.analyze(rows, self.cfg())
        self.assertIn("unsafe_side_effect_retry", [r["type"] for r in report["reasons"]])

    def test_call_id_does_not_change_fingerprint(self):
        a = {"tool": "x", "args": {"v": 1}, "result": "same", "call_id": "a"}
        b = {"tool": "x", "args": {"v": 1}, "result": "same", "call_id": "b"}
        self.assertEqual(mod.fingerprint(a), mod.fingerprint(b))


if __name__ == "__main__":
    unittest.main()
