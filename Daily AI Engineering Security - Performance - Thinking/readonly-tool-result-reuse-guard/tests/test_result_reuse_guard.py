import unittest
from scripts.result_reuse_guard import evaluate
P={"eligible_tools":["read_file"],"max_reference_age_seconds":300,"require_dependency_fingerprint":True,"deny_if_contains_secret_marker":True,"secret_markers":["ghp_"]}
class T(unittest.TestCase):
    def test_reuse(self):
        rows=[{"tool":"read_file","args":{"p":"a"},"result":"x","dependency_fingerprint":"v1","timestamp":1},{"tool":"read_file","args":{"p":"a"},"result":"x","dependency_fingerprint":"v1","timestamp":2}]
        self.assertEqual(evaluate(rows,P)[1]["action"],"reuse_reference")
    def test_dep_change(self):
        rows=[{"tool":"read_file","args":{},"result":"x","dependency_fingerprint":"v1","timestamp":1},{"tool":"read_file","args":{},"result":"x","dependency_fingerprint":"v2","timestamp":2}]
        self.assertEqual(evaluate(rows,P)[1]["action"],"send_full")
    def test_missing_dep(self):
        self.assertEqual(evaluate([{"tool":"read_file","args":{},"result":"x","timestamp":1}],P)[0]["reason"],"dependency_fingerprint_missing")
    def test_secret_full(self):
        rows=[{"tool":"read_file","args":{},"result":"ghp_fake","dependency_fingerprint":"v1","timestamp":1},{"tool":"read_file","args":{},"result":"ghp_fake","dependency_fingerprint":"v1","timestamp":2}]
        self.assertTrue(all(x["action"]=="send_full" for x in evaluate(rows,P)))
if __name__=="__main__": unittest.main()
