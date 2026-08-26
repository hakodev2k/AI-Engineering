import unittest
from scripts.progress_circuit_breaker import evaluate

class CircuitTests(unittest.TestCase):
    def test_productive_attempts_pass(self):
        rows=[
            {"retry_key":"build","attempt":1,"failure_signature":"timeout","events":["checkpoint"],"tokens":20000},
            {"retry_key":"build","attempt":2,"failure_signature":"","events":["test_state_change"],"tokens":25000},
        ]
        self.assertEqual(evaluate(rows)["status"],"pass")

    def test_identical_failure_blocks(self):
        rows=[{"retry_key":"tool:x","attempt":i,"failure_signature":"EACCES","events":[],"tokens":1000} for i in range(1,4)]
        r=evaluate(rows)
        self.assertEqual(r["status"],"block")
        self.assertIn("identical_failure_budget_exceeded",r["blocked_keys"][0]["reasons"])

    def test_no_progress_blocks(self):
        rows=[
            {"retry_key":"loop","attempt":1,"failure_signature":"a","events":[],"tokens":1000},
            {"retry_key":"loop","attempt":2,"failure_signature":"b","events":[],"tokens":1000},
            {"retry_key":"loop","attempt":3,"failure_signature":"c","events":[],"tokens":1000},
        ]
        self.assertIn("no_progress_attempt_budget_exceeded",evaluate(rows)["blocked_keys"][0]["reasons"])

    def test_token_budget_blocks(self):
        rows=[{"retry_key":"expensive","attempt":1,"failure_signature":"","events":["new_evidence"],"tokens":200001}]
        self.assertIn("token_budget_exceeded",evaluate(rows)["blocked_keys"][0]["reasons"])

if __name__=="__main__":
    unittest.main()
