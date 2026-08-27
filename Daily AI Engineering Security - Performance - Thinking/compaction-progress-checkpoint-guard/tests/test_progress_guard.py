import unittest
from scripts.progress_guard import evaluate

CP={"task_id":"t","goal":"fix","completed_steps":["inspect"],"pending_steps":["patch"],"facts":["f"],"rejected_hypotheses":[],"progress_token":"abc","verification_status":"in-progress"}
def ev(i,sig="read:a",token="abc",count=1,evidence=None):
    return {"seq":i,"action_signature":sig,"progress_token":token,"completed_steps_count":count,"evidence_ids":evidence or []}

class Tests(unittest.TestCase):
    def test_normal_progress_continues(self):
        self.assertTrue(evaluate(CP,[ev(1),ev(2,token="def"),ev(3,token="def")])["ok"])
    def test_two_no_progress_windows_stop(self):
        r=evaluate(CP,[ev(i) for i in range(1,7)],window=3,max_no_progress_windows=2)
        self.assertFalse(r["ok"]); self.assertEqual(r["decision"],"recover")
    def test_new_evidence_counts_as_progress(self):
        self.assertTrue(evaluate(CP,[ev(1),ev(2,evidence=["E1"]),ev(3)])["ok"])
    def test_completed_step_counts_as_progress(self):
        self.assertTrue(evaluate(CP,[ev(1),ev(2,count=2),ev(3,count=2)])["ok"])

if __name__=="__main__": unittest.main()
