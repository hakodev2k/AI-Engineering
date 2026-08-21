import importlib.util, pathlib, unittest

SCRIPT = pathlib.Path(__file__).parents[1] / "scripts" / "mutation_reconcile.py"
spec = importlib.util.spec_from_file_location("mutation_reconcile", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

class ReconcileTests(unittest.TestCase):
    def base(self, **kw):
        r = {"operation_id":"op-1","dispatch_state":"dispatched","risk":"low","readback":"unknown"}
        r.update(kw); return r

    def test_committed_suppresses_retry(self):
        self.assertEqual(mod.decide(self.base(readback="committed"))["action"], "reuse_committed_result")

    def test_unknown_blocks(self):
        self.assertEqual(mod.decide(self.base())["action"], "block_and_readback")

    def test_absent_retry_safe_allows_low_risk_retry(self):
        self.assertEqual(mod.decide(self.base(readback="absent", retry_safe=True))["action"], "retry_allowed")

    def test_high_risk_requires_approval(self):
        self.assertEqual(mod.decide(self.base(readback="absent", retry_safe=True, risk="high"))["action"], "require_human_approval")

    def test_high_risk_with_approval_allows_retry(self):
        self.assertEqual(mod.decide(self.base(readback="absent", retry_safe=True, risk="high", human_approved_retry=True))["action"], "retry_allowed")

if __name__ == "__main__": unittest.main()
