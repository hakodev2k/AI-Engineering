import importlib.util, pathlib, unittest
P=pathlib.Path(__file__).parents[1]/"scripts"/"audit_idle_inference.py"
spec=importlib.util.spec_from_file_location("auditmod",P); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
class TestAudit(unittest.TestCase):
    def test_idle_request_detected(self):
        r=m.audit([{"event":"model_request","needs_follow_up":False,"has_pending_input":False,"state_changed":False,"cached_input_tokens":100}])
        self.assertEqual(1,r["idle_requests"]); self.assertEqual(100,r["idle_cached_input_tokens"])
    def test_legitimate_pending_input(self):
        r=m.audit([{"event":"model_request","has_pending_input":True,"trigger_id":"u1","cached_input_tokens":20}])
        self.assertEqual(0,r["idle_requests"])
    def test_duplicate_trigger_detected(self):
        rs=[{"event":"model_request","state_changed":True,"trigger_id":"s1"},{"event":"model_request","state_changed":True,"trigger_id":"s1"}]
        self.assertEqual(1,m.audit(rs)["idle_requests"])
    def test_terminal_always_blocks(self):
        r=m.audit([{"event":"model_request","terminal":True,"has_pending_input":True,"trigger_id":"x"}])
        self.assertEqual("terminal",r["violations"][0]["reason"])
    def test_retry_reason_change_is_fresh(self):
        r=m.audit([{"event":"model_request","retry_reason_changed":True,"trigger_id":"r2"}])
        self.assertEqual(0,r["idle_requests"])
if __name__=="__main__": unittest.main()
