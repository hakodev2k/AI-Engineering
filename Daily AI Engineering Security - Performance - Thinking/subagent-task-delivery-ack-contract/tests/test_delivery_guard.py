import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"delivery_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)
H="a"*64

class DeliveryTests(unittest.TestCase):
    def test_valid_ack_before_action(self):
        rows=[
          {"agent_id":"a","event":"spawn_requested","ts_ms":0},
          {"agent_id":"a","event":"task_delivered","ts_ms":1,"seq":1,"task_hash":H},
          {"agent_id":"a","event":"task_acknowledged","ts_ms":3,"seq":1,"task_hash":H},
          {"agent_id":"a","event":"first_action","ts_ms":4},
          {"agent_id":"a","event":"completed","ts_ms":9}]
        x=guard.analyze(rows)[0]; self.assertEqual(x["status"],"valid"); self.assertEqual(x["ack_latency_ms"]["1"],2)
    def test_action_before_ack_rejected(self):
        rows=[{"agent_id":"a","event":"task_delivered","ts_ms":1,"seq":1,"task_hash":H},{"agent_id":"a","event":"first_action","ts_ms":2},{"agent_id":"a","event":"task_acknowledged","ts_ms":3,"seq":1,"task_hash":H}]
        self.assertIn("action_before_initial_ack",guard.analyze(rows)[0]["violations"])
    def test_hash_mismatch_rejected(self):
        rows=[{"agent_id":"a","event":"task_delivered","ts_ms":1,"seq":1,"task_hash":H},{"agent_id":"a","event":"task_acknowledged","ts_ms":2,"seq":1,"task_hash":"b"*64}]
        x=guard.analyze(rows)[0]; self.assertIn("hash_mismatch:1",x["violations"]); self.assertIn("missing_initial_ack",x["violations"])
    def test_missing_followup_ack_rejected(self):
        rows=[{"agent_id":"a","event":"task_delivered","ts_ms":1,"seq":1,"task_hash":H},{"agent_id":"a","event":"task_acknowledged","ts_ms":2,"seq":1,"task_hash":H},{"agent_id":"a","event":"followup_delivered","ts_ms":5,"seq":2,"task_hash":"c"*64}]
        self.assertIn("missing_followup_ack:2",guard.analyze(rows)[0]["violations"])

if __name__=="__main__": unittest.main()
