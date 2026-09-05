import importlib.util
import pathlib
import unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "verify_tool_batch.py"
spec = importlib.util.spec_from_file_location("guard", SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)
POLICY = {"max_parallel_calls": 4, "require_terminal_result": True, "terminal_statuses": ["success","error","denied","cancelled"]}

class Tests(unittest.TestCase):
    def test_valid_parallel_batch(self):
        turn={"calls":[{"call_id":"a"},{"call_id":"b"}],"results":[{"call_id":"a","status":"success"},{"call_id":"b","status":"error"}]}
        self.assertEqual([], guard.validate(POLICY, turn))
    def test_missing_result_blocks(self):
        turn={"calls":[{"call_id":"a"},{"call_id":"b"}],"results":[{"call_id":"a","status":"success"}]}
        self.assertTrue(any("missing result" in e for e in guard.validate(POLICY, turn)))
    def test_unknown_and_duplicate_block(self):
        turn={"calls":[{"call_id":"a"}],"results":[{"call_id":"x","status":"success"},{"call_id":"x","status":"success"}]}
        errors=guard.validate(POLICY, turn)
        self.assertTrue(any("unknown" in e for e in errors)); self.assertTrue(any("duplicate terminal" in e for e in errors))
    def test_overflow_blocks(self):
        turn={"calls":[{"call_id":str(i)} for i in range(5)],"results":[{"call_id":str(i),"status":"success"} for i in range(5)]}
        self.assertTrue(any("exceeds hard limit" in e for e in guard.validate(POLICY, turn)))
    def test_nonterminal_blocks(self):
        turn={"calls":[{"call_id":"a"}],"results":[{"call_id":"a","status":"pending"}]}
        self.assertTrue(any("invalid status" in e for e in guard.validate(POLICY, turn)))

if __name__ == "__main__": unittest.main()
