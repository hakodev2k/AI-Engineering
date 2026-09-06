#!/usr/bin/env python3
import json, subprocess, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "cache_transition_audit.py"

class AuditTests(unittest.TestCase):
    def run_audit(self, rows, compatible=True):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "trace.jsonl"
            p.write_text("\n".join(json.dumps(r) for r in rows) + "\n", encoding="utf-8")
            cmd = ["python3", str(SCRIPT), "--trace", str(p)]
            if compatible: cmd.append("--compatible")
            run = subprocess.run(cmd, text=True, capture_output=True)
            out = json.loads(run.stdout if run.stdout else run.stderr)
            return run.returncode, out

    def test_stable_request_effort_with_configuration_update_passes(self):
        rows = [
            {"session_id":"s","seq":1,"request_reasoning_effort":"low","input_items":[],"input_tokens":1000,"cached_input_tokens":800,"quality_pass":True},
            {"session_id":"s","seq":2,"request_reasoning_effort":"low","input_items":[{"type":"configuration_update","reasoning":{"effort":"high"}}],"input_tokens":1000,"cached_input_tokens":900,"quality_pass":True}
        ]
        code, out = self.run_audit(rows)
        self.assertEqual(code, 0); self.assertEqual(out["status"], "pass")
        self.assertEqual(out["transitions"][0]["kind"], "configuration_update")

    def test_request_level_effort_mutation_fails_compatible_flow(self):
        rows = [
            {"session_id":"s","seq":1,"request_reasoning_effort":"low","input_items":[]},
            {"session_id":"s","seq":2,"request_reasoning_effort":"high","input_items":[]}
        ]
        code, out = self.run_audit(rows)
        self.assertEqual(code, 20); self.assertEqual(out["status"], "fail")
        self.assertTrue(any(f.get("reason") == "request-level-effort-mutated" for f in out["findings"]))

    def test_mutation_is_review_when_topology_not_declared_compatible(self):
        rows = [
            {"session_id":"s","seq":1,"request_reasoning_effort":"low","input_items":[]},
            {"session_id":"s","seq":2,"request_reasoning_effort":"high","input_items":[]}
        ]
        code, out = self.run_audit(rows, compatible=False)
        self.assertEqual(code, 10); self.assertEqual(out["status"], "review")

    def test_malformed_record_is_error(self):
        code, out = self.run_audit([{"session_id":"s","seq":1}], compatible=True)
        self.assertEqual(code, 30); self.assertEqual(out["status"], "error")

if __name__ == "__main__": unittest.main()
