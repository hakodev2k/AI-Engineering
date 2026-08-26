import unittest
from scripts.validate_completion import validate

BASE={"terminal_reason":"completed","result":"Audit complete; report saved.","expected_deliverables":["report.md"],"delivered":["report.md"],"unresolved_actions":[],"verification":{"required":True,"status":"passed","independent_required":True,"independent":True},"implemented":True,"measured":True}

class CompletionTests(unittest.TestCase):
    def test_valid(self): self.assertTrue(validate(dict(BASE))["ok"])
    def test_empty_success_rejected(self):
        e=dict(BASE); e["result"]=""; self.assertIn("missing_final_result",validate(e)["reasons"])
    def test_tool_deferred_rejected(self):
        e=dict(BASE); e["terminal_reason"]="tool_deferred"; e["deferred_tool_use"]={"tool":"bash"}; r=validate(e); self.assertFalse(r["ok"]); self.assertIn("non_success_terminal:tool_deferred",r["reasons"])
    def test_missing_deliverable_rejected(self):
        e=dict(BASE); e["delivered"]=[]; self.assertIn("missing_deliverable:report.md",validate(e)["reasons"])
    def test_independent_verification_required(self):
        e=dict(BASE); e["verification"]={"required":True,"status":"passed","independent_required":True,"independent":False}; self.assertIn("independent_verification_missing",validate(e)["reasons"])
if __name__=="__main__": unittest.main()
