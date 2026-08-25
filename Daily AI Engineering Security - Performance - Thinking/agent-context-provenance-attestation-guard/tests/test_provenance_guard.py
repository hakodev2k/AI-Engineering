import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "provenance_guard.py"
spec = importlib.util.spec_from_file_location("provenance_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

SHA = "a" * 64


def run(events):
    with tempfile.TemporaryDirectory() as td:
        p = Path(td) / "events.jsonl"
        p.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        return mod.validate_file(p)


class ProvenanceGuardTests(unittest.TestCase):
    def test_authenticated_recorded_user_passes(self):
        report = run([{"event_id":"u1","role":"user","source":"user_ingress","source_id":"web:42","transcript_recorded":True,"authenticated_user":True,"ingress_event_id":"ing-42","content_sha256":SHA}])
        self.assertTrue(report["verified"])

    def test_unlogged_user_event_blocks(self):
        report = run([{"event_id":"u2","role":"user","source":"user_ingress","source_id":"api:x","transcript_recorded":False,"authenticated_user":True,"ingress_event_id":"ing-x","content_sha256":SHA}])
        self.assertIn("user_event_not_durably_recorded", {v["code"] for v in report["violations"]})

    def test_harness_as_user_blocks(self):
        report = run([{"event_id":"h1","role":"user","source":"harness","source_id":"queue:1","transcript_recorded":True,"authenticated_user":False,"content_sha256":SHA}])
        codes = {v["code"] for v in report["violations"]}
        self.assertIn("user_role_source_mismatch", codes)
        self.assertIn("synthetic_event_impersonates_user", codes)

    def test_unknown_origin_blocks(self):
        report = run([{"event_id":"x1","role":"system","source":"unknown","source_id":"unknown:1","transcript_recorded":True,"content_sha256":SHA}])
        self.assertIn("unknown_origin", {v["code"] for v in report["violations"]})

    def test_duplicate_event_id_blocks(self):
        e={"event_id":"d","role":"assistant","source":"assistant","source_id":"a","transcript_recorded":True,"content_sha256":SHA}
        report = run([e,e])
        self.assertIn("duplicate_event_id", {v["code"] for v in report["violations"]})


if __name__ == "__main__":
    unittest.main()
