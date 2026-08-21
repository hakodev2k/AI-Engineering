import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "poll_guard.py"
POLICY = {"material_fields":["state","progress","failure_signature"],"terminal_states":["completed","failed"],"initial_interval_seconds":10,"max_interval_seconds":120,"backoff_multiplier":2,"max_polls":5,"max_wall_clock_seconds":100,"identical_failure_limit":2}

class PollGuardTests(unittest.TestCase):
    def run_guard(self, status, previous="", polls=1, elapsed=10, interval=10, failures=0):
        with tempfile.TemporaryDirectory() as d:
            cfg = Path(d)/"p.json"; cfg.write_text(json.dumps(POLICY), encoding="utf-8")
            return subprocess.run([sys.executable,str(SCRIPT),"--config",str(cfg),"--status",json.dumps(status),"--previous-fingerprint",previous,"--poll-count",str(polls),"--elapsed-seconds",str(elapsed),"--current-interval",str(interval),"--identical-failure-count",str(failures)],capture_output=True,text=True)

    def test_terminal_emits_immediately(self):
        p=self.run_guard({"state":"completed","progress":100})
        self.assertEqual(json.loads(p.stdout)["decision"],"terminal")

    def test_unchanged_suppresses_and_backs_off(self):
        first=self.run_guard({"state":"running","progress":10})
        fp=json.loads(first.stdout)["fingerprint"]
        second=self.run_guard({"state":"running","progress":10}, previous=fp, interval=10)
        out=json.loads(second.stdout)
        self.assertEqual(out["decision"],"suppress")
        self.assertEqual(out["next_interval_seconds"],20)

    def test_changed_state_emits(self):
        first=self.run_guard({"state":"running","progress":10})
        fp=json.loads(first.stdout)["fingerprint"]
        second=self.run_guard({"state":"running","progress":20}, previous=fp)
        self.assertEqual(json.loads(second.stdout)["decision"],"emit")

    def test_budget_circuit_breaks(self):
        p=self.run_guard({"state":"running","progress":10}, polls=5)
        self.assertEqual(p.returncode,2)
        self.assertEqual(json.loads(p.stdout)["decision"],"circuit-break")

if __name__ == "__main__": unittest.main()
