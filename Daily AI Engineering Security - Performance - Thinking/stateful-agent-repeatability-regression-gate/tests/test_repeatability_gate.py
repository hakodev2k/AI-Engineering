import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "repeatability_gate.py"
spec = importlib.util.spec_from_file_location("repeatability", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class RepeatabilityTests(unittest.TestCase):
    def rows(self, outcomes):
        return [{"task_id":"t","trial":i+1,"passed":p,"collateral_effect":False,"harness_error":False,"evidence":f"e{i}"} for i,p in enumerate(outcomes)]

    def test_all_success(self):
        metrics, errors = mod.calculate(self.rows([True]*5), 5)
        self.assertEqual([], errors)
        self.assertEqual(1.0, metrics["all_runs_success_task_rate"])
        self.assertEqual(0.0, metrics["flaky_task_rate"])

    def test_flaky_task_detected(self):
        metrics, _ = mod.calculate(self.rows([True, False, True, True, True]), 5)
        self.assertEqual(1.0, metrics["flaky_task_rate"])

    def test_insufficient_trials_is_invalid_evidence(self):
        _, errors = mod.calculate(self.rows([True, True]), 5)
        self.assertTrue(errors)

    def test_collateral_blocks(self):
        rows = self.rows([True]*5); rows[2]["collateral_effect"] = True
        metrics, _ = mod.calculate(rows, 5)
        cfg = {"min_run_pass_rate":0.0,"min_all_runs_success_task_rate":0.0,"max_flaky_task_rate":1.0,"max_never_pass_task_rate":1.0,"max_harness_error_rate":1.0,"block_on_any_collateral_effect":True}
        self.assertIn("collateral effects observed", mod.gate(cfg, metrics))

    def test_never_pass_detected(self):
        metrics, _ = mod.calculate(self.rows([False]*5), 5)
        self.assertEqual(1.0, metrics["never_pass_task_rate"])


if __name__ == "__main__":
    unittest.main()
