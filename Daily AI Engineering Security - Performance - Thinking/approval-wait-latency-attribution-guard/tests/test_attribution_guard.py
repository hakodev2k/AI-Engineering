import importlib.util, pathlib, unittest

P=pathlib.Path(__file__).parents[1]/"scripts"/"attribution_guard.py"
spec=importlib.util.spec_from_file_location("guard",P); guard=importlib.util.module_from_spec(spec); spec.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def test_separates_approval_and_execution(self):
        rows=[
          {"tool_id":"t1","event":"approval_requested","ts_ms":0},
          {"tool_id":"t1","event":"approval_decided","ts_ms":60000},
          {"tool_id":"t1","event":"execution_started","ts_ms":60010},
          {"tool_id":"t1","event":"execution_finished","ts_ms":61010},
          {"tool_id":"t1","event":"result_consumed","ts_ms":61110}]
        x=guard.analyze(rows)[0]
        self.assertEqual(x["approval_wait_ms"],60000); self.assertEqual(x["execution_ms"],1000); self.assertEqual(x["status"],"attributable")
    def test_missing_execution_fails_closed(self):
        rows=[{"tool_id":"t","event":"approval_requested","ts_ms":0},{"tool_id":"t","event":"approval_decided","ts_ms":100}]
        self.assertEqual(guard.analyze(rows)[0]["status"],"unsafe_attribution")
    def test_negative_execution_rejected(self):
        rows=[{"tool_id":"t","event":"execution_started","ts_ms":10},{"tool_id":"t","event":"execution_finished","ts_ms":5}]
        self.assertIn("negative_execution",guard.analyze(rows)[0]["violations"])

if __name__=="__main__": unittest.main()
