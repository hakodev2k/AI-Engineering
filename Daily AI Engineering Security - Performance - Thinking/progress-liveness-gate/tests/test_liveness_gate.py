import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).resolve().parents[1]/"scripts"/"liveness_gate.py"
s=importlib.util.spec_from_file_location("lg",P); m=importlib.util.module_from_spec(s); s.loader.exec_module(m)
class T(unittest.TestCase):
 def test_verified_progress_resets_streak(self):
  r=m.evaluate({"no_progress_streak":2,"events":[{"kind":"deliverable_changed","id":"a","verified":True}],"mandatory_criteria_open":1})
  self.assertEqual(r["decision"],"continue"); self.assertEqual(r["no_progress_streak"],0)
 def test_status_does_not_count(self):
  r=m.evaluate({"no_progress_streak":2,"events":[{"kind":"status","id":"x","verified":True}],"mandatory_criteria_open":1})
  self.assertEqual(r["decision"],"stop")
 def test_requires_changed_hypothesis(self):
  r=m.evaluate({"no_progress_streak":1,"events":[],"hypothesis_changed":False,"mandatory_criteria_open":1})
  self.assertEqual(r["decision"],"change-hypothesis")
 def test_cannot_complete_with_open_criteria(self):
  r=m.evaluate({"events":[{"kind":"verified_evidence_added","id":"e","verified":True}],"claim_complete":True,"mandatory_criteria_open":1})
  self.assertEqual(r["decision"],"stop")
if __name__=="__main__": unittest.main()