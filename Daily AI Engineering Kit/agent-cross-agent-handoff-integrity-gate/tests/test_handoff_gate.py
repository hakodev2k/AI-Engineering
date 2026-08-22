import importlib.util, json, pathlib, tempfile, unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("handoff_gate", ROOT / "scripts/handoff_gate.py")
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)


def base_handoff():
    return {
        "handoff_id":"handoff-test-0001","producer":"producer","consumer":"consumer","task":"test",
        "status":"ready","risk":[],
        "facts":[{"text":"fact","confidence":1.0,"evidence_ids":["ev-1"]}],
        "hypotheses":[],"decisions":[],
        "evidence":[{"id":"ev-1","source":"repo:file","summary":"evidence"}],
        "open_questions":[],"artifacts":[],
        "verification":{"status":"not-run","checks":[]}
    }

class HandoffGateTests(unittest.TestCase):
    def test_valid_ready_handoff(self):
        self.assertEqual([], MOD.validate(base_handoff(), ROOT, False, None))

    def test_ready_fact_requires_evidence_reference(self):
        data = base_handoff(); data["facts"][0]["evidence_ids"] = []
        errors = MOD.validate(data, ROOT, False, None)
        self.assertTrue(any("no evidence_ids" in e for e in errors))

    def test_unknown_evidence_reference_fails(self):
        data = base_handoff(); data["facts"][0]["evidence_ids"] = ["missing"]
        errors = MOD.validate(data, ROOT, False, None)
        self.assertTrue(any("unknown evidence" in e for e in errors))

    def test_verified_requires_passed_verification(self):
        data = base_handoff(); data["status"] = "verified"
        errors = MOD.validate(data, ROOT, False, None)
        self.assertTrue(any("verification.status=passed" in e for e in errors))

    def test_high_risk_requires_independent_verifier(self):
        data = base_handoff(); data["status"] = "verified"; data["risk"] = ["security"]
        data["verification"] = {"status":"passed","checks":[],"verifier":"producer"}
        errors = MOD.validate(data, ROOT, False, None)
        self.assertTrue(any("independent verifier" in e for e in errors))

    def test_artifact_hash_verification(self):
        data = base_handoff()
        with tempfile.TemporaryDirectory() as td:
            root = pathlib.Path(td); f = root / "artifact.txt"; f.write_text("safe", encoding="utf-8")
            data["artifacts"] = [{"path":"file:artifact.txt","sha256":MOD.sha256_file(f)}]
            self.assertEqual([], MOD.validate(data, root, True, None))
            f.write_text("changed", encoding="utf-8")
            self.assertTrue(any("digest mismatch" in e for e in MOD.validate(data, root, True, None)))

if __name__ == "__main__":
    unittest.main()
