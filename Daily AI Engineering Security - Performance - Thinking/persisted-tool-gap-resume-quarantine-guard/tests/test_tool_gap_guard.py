import unittest
from scripts.tool_gap_guard import scan

class ToolGapTests(unittest.TestCase):
    def test_complete_history_verified(self):
        r=scan([{"type":"tool_call","tool_call_id":"a"},{"type":"tool_result","tool_call_id":"a"}])
        self.assertEqual(r["status"],"verified")

    def test_missing_result_quarantines(self):
        r=scan([{"type":"tool_call","tool_call_id":"a"}])
        self.assertEqual(r["status"],"quarantine")
        self.assertEqual(r["unresolved_calls"],["a"])

    def test_orphan_result_quarantines(self):
        r=scan([{"type":"tool_result","tool_call_id":"a"}])
        self.assertEqual(r["orphan_results"],["a"])

    def test_duplicate_call_id_quarantines(self):
        r=scan([{"type":"tool_call","tool_call_id":"a"},{"type":"tool_call","tool_call_id":"a"},{"type":"tool_result","tool_call_id":"a"}])
        self.assertEqual(r["duplicate_call_ids"],["a"])

    def test_duplicate_result_id_quarantines(self):
        r=scan([{"type":"tool_call","tool_call_id":"a"},{"type":"tool_result","tool_call_id":"a"},{"type":"tool_result","tool_call_id":"a"}])
        self.assertEqual(r["duplicate_result_ids"],["a"])

    def test_missing_id_is_malformed(self):
        r=scan([{"type":"tool_call"}])
        self.assertEqual(r["status"],"quarantine")
        self.assertTrue(r["malformed"])

if __name__ == "__main__": unittest.main()
