import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).resolve().parents[1]/"scripts"/"permission_audit.py"
s=importlib.util.spec_from_file_location("pa",P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class T(unittest.TestCase):
 def test_hard_deny_wins(self):
  r=m.evaluate({"risk":"high","layers":[{"name":"allowlist","decision":"allow","priority":50},{"name":"classifier","decision":"deny","priority":100,"hard":True}]})
  self.assertEqual(r["effective_decision"],"deny"); self.assertTrue(r["conflicts"])
 def test_clean_allow(self):
  r=m.evaluate({"risk":"low","layers":[{"name":"allowlist","decision":"allow","priority":10}]})
  self.assertEqual(r["effective_decision"],"allow"); self.assertFalse(r["conflicts"])
 def test_unknown_high_risk_indeterminate(self):
  r=m.evaluate({"risk":"high","layers":[{"name":"allowlist","decision":"allow","priority":10},{"name":"classifier","decision":"unknown","priority":1}]})
  self.assertEqual(r["effective_decision"],"indeterminate")
if __name__=="__main__": unittest.main()