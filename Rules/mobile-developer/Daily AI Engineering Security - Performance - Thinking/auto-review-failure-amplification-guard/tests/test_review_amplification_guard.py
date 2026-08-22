import importlib.util, pathlib, unittest

MODULE = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "review_amplification_guard.py"
spec = importlib.util.spec_from_file_location("guard", MODULE)
guard = importlib.util.module_from_spec(spec); assert spec and spec.loader; spec.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def event(self, scope="expected_in_sandbox", minute=0):
        return {"timestamp": f"2026-08-20T09:{minute:02d}:00Z", "scope": scope, "operation": "apply_patch", "target_class": "workspace-file", "failure_code": "ACCESS_DENIED", "failure_message": "sandbox helper access denied at C:\\repo\\a.cs", "requested_permission": "escalated", "review_input_tokens": 1000}

    def test_repeated_internal_failure_is_bounded(self):
        state = {"fingerprints": {}}
        for m in (0, 1, 2):
            code, out = guard.gate(self.event(minute=m), state, 3, 30)
            self.assertEqual(code, 0); self.assertEqual(out["decision"], "allow_review")
        code, out = guard.gate(self.event(minute=3), state, 3, 30)
        self.assertEqual(code, 2); self.assertEqual(out["decision"], "block_repeat")

    def test_boundary_crossing_still_reviews(self):
        code, out = guard.gate(self.event(scope="boundary_crossing"), {"fingerprints": {}}, 1, 30)
        self.assertEqual(code, 0); self.assertEqual(out["reason"], "genuine_boundary_crossing")

    def test_unknown_scope_fails_closed(self):
        code, out = guard.gate(self.event(scope="unknown"), {"fingerprints": {}}, 3, 30)
        self.assertEqual(code, 1); self.assertEqual(out["decision"], "require_human")

    def test_path_does_not_change_fingerprint(self):
        a = self.event(); b = self.event(); b["failure_message"] = "sandbox helper access denied at D:\\work\\b.cs"
        self.assertEqual(guard.fingerprint(a), guard.fingerprint(b))

if __name__ == "__main__": unittest.main()