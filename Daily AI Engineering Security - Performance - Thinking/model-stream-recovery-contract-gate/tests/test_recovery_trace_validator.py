import importlib.util, pathlib, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("validator",ROOT/"scripts"/"recovery_trace_validator.py")
M=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(M)

def trace(events,recovery_required=True): return {"run_id":"r1","turn_id":"t1","recovery_required":recovery_required,"events":events}

class ContractTests(unittest.TestCase):
    def test_recoverable_stream_stall_passes_with_hook(self):
        v,s=M.validate(trace([
            {"seq":1,"event":"stream_error","cause":"stream_stall","actor":"transport"},
            {"seq":2,"event":"terminal_classified","cause":"stream_stall","actor":"transport"},
            {"seq":3,"event":"recovery_hook_start","actor":"hook"},
            {"seq":4,"event":"recovery_hook_end","actor":"hook","result":"continued"},
            {"seq":5,"event":"retry_start","actor":"runtime"},
            {"seq":6,"event":"terminal_final","cause":"completed","actor":"runtime","result":"success"}
        ]),2,"stream_stall")
        self.assertEqual(v,[])
    def test_machine_failure_cannot_be_user_cancel(self):
        v,_=M.validate(trace([
            {"seq":1,"event":"watchdog_timeout","cause":"watchdog_timeout","actor":"watchdog"},
            {"seq":2,"event":"terminal_classified","cause":"user_cancelled","actor":"user"},
            {"seq":3,"event":"terminal_final","cause":"user_cancelled","actor":"runtime","result":"aborted"}
        ]),2)
        self.assertTrue(any("misclassified" in x for x in v))
    def test_user_cancel_blocks_recovery(self):
        v,_=M.validate(trace([
            {"seq":1,"event":"user_cancel","cause":"user_cancelled","actor":"user"},
            {"seq":2,"event":"terminal_classified","cause":"user_cancelled","actor":"user"},
            {"seq":3,"event":"retry_start","actor":"runtime"},
            {"seq":4,"event":"terminal_final","cause":"user_cancelled","actor":"runtime","result":"aborted"}
        ]),2)
        self.assertTrue(any("after explicit user cancellation" in x for x in v))
    def test_retry_budget_is_bounded(self):
        events=[{"seq":1,"event":"provider_error","cause":"provider_error","actor":"provider"},{"seq":2,"event":"terminal_classified","cause":"provider_error","actor":"provider"},{"seq":3,"event":"recovery_hook_start","actor":"hook"},{"seq":4,"event":"recovery_hook_end","actor":"hook","result":"continued"}]
        events += [{"seq":i,"event":"retry_start","actor":"runtime"} for i in (5,6,7)]
        events += [{"seq":8,"event":"terminal_final","cause":"provider_error","actor":"runtime","result":"failure"}]
        v,_=M.validate(trace(events),2)
        self.assertTrue(any("retry budget exceeded" in x for x in v))
    def test_missing_final_fails(self):
        v,_=M.validate(trace([{"seq":1,"event":"transport_error","actor":"transport"},{"seq":2,"event":"terminal_classified","cause":"transport_error","actor":"transport"},{"seq":3,"event":"recovery_hook_start","actor":"hook"},{"seq":4,"event":"recovery_hook_end","actor":"hook","result":"failure"}]),2)
        self.assertTrue(any("terminal_final" in x for x in v))

if __name__=="__main__": unittest.main()
