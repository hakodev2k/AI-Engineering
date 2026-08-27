import unittest
from scripts.convergence_guard import evaluate

POLICY={
 "max_cycles":8,
 "max_no_progress_cycles":2,
 "max_new_work_items_per_cycle":2,
 "require_failed_criterion_for_new_work":True,
 "require_snapshot_on_stop":True,
 "terminal_statuses":["passed","waived","blocked"],
}

class GuardTests(unittest.TestCase):
    def test_complete(self):
        ledger={"cycle":3,"criteria":[{"id":"build","status":"passed"},{"id":"test","status":"passed"}],
                "history":[{"cycle":1,"remaining":2,"new_work_items":0,"progress_events":1},
                           {"cycle":2,"remaining":1,"new_work_items":0,"progress_events":1},
                           {"cycle":3,"remaining":0,"new_work_items":0,"progress_events":1}]}
        self.assertEqual(evaluate(ledger,POLICY)["decision"],"complete")

    def test_repeated_empty_cycles_stop(self):
        ledger={"cycle":4,"criteria":[{"id":"test","status":"pending"}],
                "history":[{"cycle":1,"remaining":1,"new_work_items":0,"progress_events":0},
                           {"cycle":2,"remaining":1,"new_work_items":0,"progress_events":0},
                           {"cycle":3,"remaining":1,"new_work_items":0,"progress_events":0}]}
        self.assertFalse(evaluate(ledger,POLICY)["ok"])

    def test_unjustified_expansion_stops(self):
        ledger={"cycle":2,"criteria":[{"id":"test","status":"pending"}],
                "history":[{"cycle":1,"remaining":1,"new_work_items":1,"progress_events":1,
                            "new_work_criterion_ids":["new-review"]}]}
        self.assertIn("unjustified_new_work:cycle=1",evaluate(ledger,POLICY)["reasons"])

    def test_failed_criterion_can_spawn_bounded_work(self):
        ledger={"cycle":2,"criteria":[{"id":"test","status":"failed"},{"id":"build","status":"passed"}],
                "history":[{"cycle":1,"remaining":1,"new_work_items":1,"progress_events":1,
                            "new_work_criterion_ids":["test"]}]}
        self.assertEqual(evaluate(ledger,POLICY)["decision"],"continue_bounded")

    def test_cycle_cap(self):
        ledger={"cycle":9,"criteria":[{"id":"test","status":"pending"}],"history":[]}
        self.assertIn("max_cycles_exceeded",evaluate(ledger,POLICY)["reasons"])

if __name__=="__main__":
    unittest.main()
