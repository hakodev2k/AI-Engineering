import unittest
from scripts.convergence_guard import evaluate

class ConvergenceTests(unittest.TestCase):
    def test_progress_continues(self):
        r=evaluate([{"target_criterion":"A","accepted_delta":["file:a"],"scope_growth":0,"verification":"accepted"}])
        self.assertEqual(r["decision"],"continue")

    def test_two_zero_delta_cycles_stop(self):
        cycles=[
            {"target_criterion":"A","accepted_delta":[],"scope_growth":0,"verification":"rejected"},
            {"target_criterion":"A","accepted_delta":[],"scope_growth":0,"verification":"blocked"},
        ]
        self.assertEqual(evaluate(cycles)["decision"],"stop-and-escalate")

    def test_scope_growth_stops(self):
        cycles=[{"target_criterion":"A","accepted_delta":["x"],"scope_growth":2,"verification":"accepted"}]
        self.assertEqual(evaluate(cycles)["decision"],"stop-and-escalate")

    def test_complete_requires_verified_delta(self):
        cycles=[{"target_criterion":"A","accepted_delta":["test:A"],"scope_growth":0,"verification":"accepted","all_required_criteria_verified":True}]
        self.assertEqual(evaluate(cycles)["decision"],"complete")

    def test_invalid_log_rejected(self):
        with self.assertRaises(ValueError):
            evaluate([{"target_criterion":"A"}])

if __name__=="__main__": unittest.main()
