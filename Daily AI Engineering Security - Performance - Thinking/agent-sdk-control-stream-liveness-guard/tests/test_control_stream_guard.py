import json, subprocess, sys, tempfile, unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/"scripts"/"control_stream_guard.py"

class Tests(unittest.TestCase):
    def run_trace(self, events):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"t.ndjson"; p.write_text("\n".join(json.dumps(x) for x in events),encoding="utf-8")
            return subprocess.run([sys.executable,str(SCRIPT),str(p)],text=True,capture_output=True)
    def test_clean_lifecycle(self):
        r=self.run_trace([{"event":"turn_start","id":"t","ts_ms":0},{"event":"control_open","id":"c"},{"event":"control_settle","id":"c"},{"event":"turn_end","id":"t","ts_ms":20},{"event":"transport_close"}])
        self.assertEqual(r.returncode,0,r.stdout)
    def test_close_with_active_control_blocks(self):
        r=self.run_trace([{"event":"turn_start","id":"t"},{"event":"control_open","id":"c"},{"event":"transport_close"},{"event":"control_settle","id":"c"},{"event":"turn_end","id":"t"}])
        self.assertEqual(r.returncode,2); self.assertIn("premature-close",r.stdout)
    def test_background_worker_blocks_close(self):
        r=self.run_trace([{"event":"worker_start","id":"w"},{"event":"transport_close"},{"event":"worker_end","id":"w"}])
        self.assertEqual(r.returncode,2); self.assertIn("workers",r.stdout)
    def test_stream_closed_failure_is_regression(self):
        r=self.run_trace([{"event":"tool_failure","error":"Tool permission request failed: Error: Stream closed"}])
        self.assertEqual(r.returncode,2); self.assertIn("stream-closed-tool-failure",r.stdout)
    def test_unsettled_eof_blocks(self):
        r=self.run_trace([{"event":"turn_start","id":"t"}])
        self.assertEqual(r.returncode,2); self.assertIn("unsettled-at-eof",r.stdout)

if __name__=="__main__": unittest.main()
