#!/usr/bin/env python3
import json, pathlib, subprocess, sys, tempfile, unittest

SCRIPT=pathlib.Path(__file__).parents[1]/"scripts"/"polling_trace_analyzer.py"
class Tests(unittest.TestCase):
    def run_case(self,events,cfg):
        with tempfile.TemporaryDirectory() as d:
            t=pathlib.Path(d)/"t.jsonl"; c=pathlib.Path(d)/"c.json"
            t.write_text("\n".join(json.dumps(x) for x in events),encoding="utf-8"); c.write_text(json.dumps(cfg),encoding="utf-8")
            return subprocess.run([sys.executable,str(SCRIPT),str(t),"--config",str(c)],capture_output=True,text=True)
    def test_pass(self):
        cfg={"max_poll_turn_ratio":.5,"max_poll_token_ratio":.5,"max_consecutive_no_progress_polls":2}
        r=self.run_case([{"kind":"model_turn","action":"work","tokens_in":10},{"kind":"model_turn","action":"wait","state_changed":False,"tokens_in":2}],cfg)
        self.assertEqual(r.returncode,0)
    def test_block_repeated_poll(self):
        cfg={"max_poll_turn_ratio":.2,"max_poll_token_ratio":.2,"max_consecutive_no_progress_polls":1}
        r=self.run_case([{"kind":"model_turn","action":"wait","state_changed":False,"tokens_in":10},{"kind":"model_turn","action":"wait","state_changed":False,"tokens_in":10}],cfg)
        self.assertEqual(r.returncode,3)
    def test_invalid(self):
        cfg={"max_poll_turn_ratio":.2,"max_poll_token_ratio":.2,"max_consecutive_no_progress_polls":1}
        with tempfile.TemporaryDirectory() as d:
            t=pathlib.Path(d)/"t.jsonl"; c=pathlib.Path(d)/"c.json"; t.write_text("not-json",encoding="utf-8"); c.write_text(json.dumps(cfg),encoding="utf-8")
            r=subprocess.run([sys.executable,str(SCRIPT),str(t),"--config",str(c)])
            self.assertEqual(r.returncode,2)
if __name__=="__main__": unittest.main()
