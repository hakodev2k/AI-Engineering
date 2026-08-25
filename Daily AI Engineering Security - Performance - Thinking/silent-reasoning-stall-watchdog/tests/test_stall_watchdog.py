import tempfile, unittest
from pathlib import Path
from scripts.stall_watchdog import load_events, classify, parse_ts

class StallWatchdogTests(unittest.TestCase):
    def trace(self,text):
        f=tempfile.NamedTemporaryFile("w",delete=False,encoding="utf-8"); f.write(text); f.close(); self.addCleanup(lambda:Path(f.name).unlink(missing_ok=True)); return load_events(Path(f.name))
    def test_silent_token_burn(self):
        ev=self.trace('{"ts":"2026-08-25T14:00:00Z","kind":"text","total_tokens":1000}\n{"ts":"2026-08-25T14:01:50Z","kind":"usage","total_tokens":9000}\n'); state,code,meta=classify(ev,parse_ts("2026-08-25T14:02:00Z"),60,5000); self.assertEqual((state,code),("silent_token_burn",10)); self.assertEqual(meta["silent_token_delta"],8000)
    def test_event_stream_stall(self):
        ev=self.trace('{"ts":"2026-08-25T14:00:00Z","kind":"text","total_tokens":1000}\n'); state,code,_=classify(ev,parse_ts("2026-08-25T14:03:00Z"),120,5000); self.assertEqual((state,code),("event_stream_stall",11))
    def test_terminal(self):
        ev=self.trace('{"ts":"2026-08-25T14:00:00Z","kind":"terminal"}\n'); state,code,_=classify(ev,parse_ts("2026-08-25T15:00:00Z"),60,1); self.assertEqual((state,code),("terminal",0))
    def test_invalid_order(self):
        with self.assertRaises(ValueError): self.trace('{"ts":"2026-08-25T14:01:00Z","kind":"usage"}\n{"ts":"2026-08-25T14:00:00Z","kind":"usage"}\n')
if __name__=="__main__": unittest.main()
