import json, subprocess, sys, tempfile, unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "background_budget_guard.py"

def run(events, *args):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"trace.jsonl"
        p.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        return subprocess.run([sys.executable,str(SCRIPT),str(p),*args],capture_output=True,text=True)

def ev(job="bg1", state="s1", progress="p1", tokens=10):
    return {"timestamp":"2026-08-24T12:00:00+07:00","job_id":job,"parent_id":"parent","event":"model_request","input_tokens":tokens,"output_tokens":1,"cached_input_tokens":0,"state_fingerprint":state,"progress_fingerprint":progress}

class GuardTests(unittest.TestCase):
    def test_normal_progress_passes(self):
        r=run([ev(state="s1",progress="p1"),ev(state="s2",progress="p2")])
        self.assertEqual(r.returncode,0,r.stderr+r.stdout)
    def test_repeated_state_blocks(self):
        r=run([ev(),ev(),ev(),ev()],"--max-no-progress","3")
        self.assertEqual(r.returncode,2,r.stdout)
        self.assertIn("no-progress",r.stdout)
    def test_request_budget_blocks(self):
        r=run([ev(),ev(state="s2",progress="p2")],"--max-requests","1")
        self.assertEqual(r.returncode,2,r.stdout)
    def test_missing_identity_is_invalid(self):
        bad=ev(); bad["job_id"]=""
        r=run([bad])
        self.assertEqual(r.returncode,3)
    def test_report_only_does_not_block(self):
        r=run([ev(),ev(),ev(),ev()],"--max-no-progress","3","--report-only")
        self.assertEqual(r.returncode,0)
        self.assertIn("violations",r.stdout)

if __name__ == "__main__": unittest.main()
